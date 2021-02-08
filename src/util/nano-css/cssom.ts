import type { NanoRenderer } from "./types"

export interface CSSOMRule extends CSSRule {
  index: number
  style: CSSStyleDeclaration
  styleMap: any
}

export interface CSSOMAddon {
  /**
     * @param selector CSS rule selector string.
     * @param prelude Media query at-rule prelude string.
     */
  createRule(selector: string, prelude?: string): CSSOMRule
}

export function addon(nano: NanoRenderer)
export function addon(renderer) {
  // CSSOM support only browser environment.
  if (!renderer.client) return

  // Style sheet for media queries.
  document.head.appendChild(renderer.msh = document.createElement("style"))

  renderer.createRule = function (selector, prelude) {
    var rawCss = selector + "{}"
    if (prelude) rawCss = prelude + "{" + rawCss + "}"
    var sheet = prelude ? renderer.msh.sheet : renderer.sh.sheet
    let index = sheet.insertRule(rawCss, sheet.cssRules.length)
    var rule = (sheet.cssRules || sheet.rules)[index]

    // Keep track of `index` where rule was inserted in the sheet. This is
    // needed for rule deletion.
    rule.index = index

    if (prelude) {
      // If rule has media query (it has prelude), move style (CSSStyleDeclaration)
      // object to the "top" to normalize it with a rule without the media
      // query, so that both rules have `.style` property available.
      var selectorRule = (rule.cssRules || rule.rules)[0]
      rule.style = selectorRule.style
      rule.styleMap = selectorRule.styleMap
    }

    return rule
  }
}
