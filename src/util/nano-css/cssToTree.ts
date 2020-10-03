import { CssLikeObject, Css } from './types';

export interface Tree {
  [atRulePrelude: string]: {
    [selector: string]: {
      [property: string]: CssLikeObject;
    };
  };
}

// export function cssToTree(tree: {}, css: Css, selector: string, prelude: string): Tree;
export function cssToTree(tree: {}, css: Css, selector: string, prelude: string) {
  let declarations = {};
  let hasDeclarations = false;
  let key, value;
  let i: number;

  for (key in css) {
    value = css[key];
    if (typeof value !== 'object') {
      hasDeclarations = true;
      declarations[key] = value;
    }
  }

  if (hasDeclarations) {
    if (!tree[prelude]) tree[prelude] = {};
    tree[prelude][selector] = declarations;
  }

  for (key in css) {
    value = css[key];
    if (typeof value === 'object') {
      if (key[0] === '@') {
        cssToTree(tree, value, selector, key);
      } else {
        var hasCurrentSymbol = key.indexOf('&') > -1;
        var selectorParts = selector.split(',');
        if (hasCurrentSymbol) {
          for (i = 0; i < selectorParts.length; i++) {
            selectorParts[i] = key.replace(/&/g, selectorParts[i]);
          }
        } else {
          for (i = 0; i < selectorParts.length; i++) {
            selectorParts[i] = selectorParts[i] + ' ' + key;
          }
        }
        cssToTree(tree, value, selectorParts.join(','), prelude);
      }
    }
  }
}
