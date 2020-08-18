import { CSSOMRule } from "./cssom";

export function removeRule(rule: CSSOMRule) {
  let maxIndex = rule.index;
  let sh = rule.parentStyleSheet!;
  let rules = sh.cssRules || sh.rules;
  maxIndex = Math.max(maxIndex, rules.length - 1);
  while (maxIndex >= 0) {
    if (rules[maxIndex] === rule) {
      sh.deleteRule(maxIndex);
      break;
    }
    maxIndex--;
  }
}
