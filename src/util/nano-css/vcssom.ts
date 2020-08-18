import { removeRule } from "./removeRule";
import { CssProps, Css, NanoRenderer } from "./types";
import { CSSOMRule } from "./cssom";
// import { NanoRenderer, CSSOMRule } from "./types";
export interface VCSSOMAddon {
  VRule: new (selector: string, mediaQuery?: string) => VRule;
  VSheet: new () => VSheet;
}
export interface VRule {
  /**
     * CSS declarations, like `{color: 'red'}`
     */
  decl: CssProps;
  rule: CSSOMRule;

  /**
     * Re-render css rule according to new CSS declarations.
     * @param decl CSS declarations, like `{color: 'red'}`
     */
  diff(decl: CssProps);

  /**
     * Removes this `VRule` from CSSOM. After calling this method, you
     * cannot call `diff` anymore as this rule will be removed from style sheet.
     */
  del();
}

export interface VSheet {
  /**
     * Re-renders style sheet according to specified CSS-like object. The `css`
     * object is a 3-level tree structure:
     *
     * ```
     * {
     *   media-query-prelude: {
     *     selector: {
     *       declarations
     *     }
     *   }
     * }
     * ```
     *
     * Example:
     *
     * ```js
     * sheet.diff({
     *   '': {
     *     '.my-class': {
     *       color: 'red',
     *     },
     *     '.my-class:hover': {
     *       color: 'blue',
     *     },
     *   },
     *   '@media only screen and (max-width: 600px)': {
     *     '.my-class': {
     *       color: 'green',
     *     },
     *   },
     * });
     * ```
     *
     * @param css CSS-like object with media queries as top level.
     */
  diff(css: Css);
}

export default function addon(nano: NanoRenderer): void;
export default function addon(renderer) {
  if (!renderer.client) return;

  let kebab = renderer.kebab;

  function VRule(selector: string, prelude: string) {
    //@ts-ignore
    this.rule = renderer.createRule(selector, prelude);
    //@ts-ignore
    this.decl = {};
  }

  VRule.prototype.diff = function (newDecl) {
    var oldDecl = this.decl;
    var style = this.rule.style;
    var property;
    for (property in oldDecl) {
      if (newDecl[property] === undefined) {
        style.removeProperty(property);
      }
    }
    for (property in newDecl) {
      if (newDecl[property] !== oldDecl[property]) {
        style.setProperty(kebab(property), newDecl[property]);
      }
    }
    this.decl = newDecl;
  };

  VRule.prototype.del = function () {
    removeRule(this.rule);
  };

  function VSheet() {
    /**
         * {
         *   '<at-rule-prelude>': {
         *     '<selector>': {
         *       color: 'red
         *     }
         *   }
         * }
         */
    //@ts-ignore
    this.tree = {};
  }

  VSheet.prototype.diff = function (newTree) {
    var oldTree = this.tree;

    // Remove media queries not present in new tree.
    for (var prelude in oldTree) {
      if (newTree[prelude] === undefined) {
        var rules = oldTree[prelude];
        for (var selector in rules) {
          rules[selector].del();
        }
      }
    }

    for (var prelude in newTree) {
      if (oldTree[prelude] === undefined) {
        // Whole media query is new.
        for (var selector in newTree[prelude]) {
          var rule = new VRule(selector, prelude);
          rule.diff(newTree[prelude][selector]);
          newTree[prelude][selector] = rule;
        }
      } else {
        // Old tree already has rules with this media query.
        var oldRules = oldTree[prelude];
        var newRules = newTree[prelude];

        // Remove rules not present in new tree.
        for (var selector in oldRules) {
          if (!newRules[selector]) {
            oldRules[selector].del();
          }
        }

        // Apply new rules.
        for (var selector in newRules) {
          var rule = oldRules[selector];
          if (rule) {
            rule.diff(newRules[selector]);
            newRules[selector] = rule;
          } else {
            rule = new VRule(selector, prelude);
            rule.diff(newRules[selector]);
            newRules[selector] = rule;
          }
        }
      }
    }

    this.tree = newTree;
  };

  renderer.VRule = VRule;
  renderer.VSheet = VSheet;
}
