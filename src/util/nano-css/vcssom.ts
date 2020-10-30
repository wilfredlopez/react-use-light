import { removeRule } from './removeRule';
import { CssProps, Css, NanoRenderer } from './types';
import { CSSOMRule } from './cssom';
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
    let oldDecl = this.decl;
    let style = this.rule.style;
    let property: string;
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
    let oldTree = this.tree;
    let prelude: string;
    let selector: string;
    let rules: any;
    let rule: any;
    let oldRules: any;
    let newRules: any;

    // Remove media queries not present in new tree.
    for (prelude in oldTree) {
      if (newTree[prelude] === undefined) {
        rules = oldTree[prelude];
        for (selector in rules) {
          rules[selector].del();
        }
      }
    }

    for (prelude in newTree) {
      if (oldTree[prelude] === undefined) {
        // Whole media query is new.
        for (selector in newTree[prelude]) {
          rule = new VRule(selector, prelude);
          rule.diff(newTree[prelude][selector]);
          newTree[prelude][selector] = rule;
        }
      } else {
        // Old tree already has rules with this media query.
        oldRules = oldTree[prelude];
        newRules = newTree[prelude];

        // Remove rules not present in new tree.
        for (selector in oldRules) {
          if (!newRules[selector]) {
            oldRules[selector].del();
          }
        }

        // Apply new rules.
        for (selector in newRules) {
          rule = oldRules[selector];
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
