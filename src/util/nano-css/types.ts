import * as CSS from "csstype";
import { CSSOMRule, CSSOMAddon } from "./cssom";
type TLength = string | number;

export interface NanoOptions {
  /**
     * Prefix added to all class names and animation names.
     */
  pfx?: string;

  /**
     * Hyperscript function of your virtual DOM library. Needed only if you use
     * addons (like `jsx`, `style`, `styled`, `component`) that create components.
     *
     * ```js
     * const nano = create({
     *     h: React.createElement,
     * });
     * ```
     */
  h?: (...args) => any;

  /**
     * Stylesheet `<sheet>` to be used to inject CSS. If not provided, one will
     * be automatically created. You can also provide an external stylesheet
     * `<link>`, but then you need to set proper attributes on it: `rel="stylesheet" type="text/css"`.
     *
     * ```js
     * const nano = create({
     *     sh: typeof window === 'object' ? document.getElementById('nano-css') : undefined,
     * });
     * ```
     */
  sh?: CSSStyleSheet;

  /**
     * Whether to be chatty in DEV mode.
     */
  verbose?: boolean;

  /**
     * Defaults to `Object.assign`.
     */
  assign?: (...objects: object[]) => object;

  /**
     * Defaults to `JSON.stringify`.
     */
  stringify?: (obj: object) => string;
}

export type CreateNano = (options?: NanoOptions) => NanoRenderer;
export interface Atoms {
  /**
     * Short for `display` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  d?: CSS.Properties['display'];

  /**
     * Short for `margin` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  mar?: CSS.Properties<TLength>['margin'];

  /**
     * Short for `margin-top` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  mart?: CSS.Properties<TLength>['marginBottom'];

  /**
     * Short for `margin-right` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  marr?: CSS.Properties<TLength>['marginBottom'];

  /**
     * Short for `margin-bottom` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  marb?: CSS.Properties<TLength>['marginBottom'];

  /**
     * Short for `margin-left` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  marl?: CSS.Properties<TLength>['marginBottom'];

  /**
     * Short for `padding` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  pad?: CSS.Properties<TLength>['padding'];

  /**
     * Short for `padding-top` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  padt?: CSS.Properties<TLength>['paddingBottom'];

  /**
     * Short for `padding-right` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  padr?: CSS.Properties<TLength>['paddingBottom'];

  /**
     * Short for `padding-bottom` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  padb?: CSS.Properties<TLength>['paddingBottom'];

  /**
     * Short for `padding-left` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  padl?: CSS.Properties<TLength>['paddingBottom'];

  /**
     * Short for `border` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  bd?: CSS.Properties<TLength>["borderBottom"];

  /**
     * Short for `border-top` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  bdt?: CSS.Properties<TLength>["borderBottom"];

  /**
     * Short for `border-right` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  bdr?: CSS.Properties<TLength>["borderBottom"];

  /**
     * Short for `border-bottom` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  bdb?: CSS.Properties<TLength>["borderBottom"];

  /**
     * Short for `border-left` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  bdl?: CSS.Properties<TLength>["borderBottom"];

  /**
     * Short for `border-radius` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  bdrad?: CSS.Properties<TLength>["borderRadius"];

  /**
     * Short for `color` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  col?: CSS.Properties['color'];

  /**
     * Short for `opacity` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  op?: number | string;

  /**
     * Short for `background` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  bg?: CSS.Properties<TLength>['background'];

  /**
     * Short for `background-color` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  bgc?: CSS.Properties['backgroundColor'];

  /**
     * Short for `font-size` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  fz?: CSS.Properties<TLength>['fontSize'];

  /**
     * Short for `font-style` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  fs?: CSS.Properties["fontStyle"];

  /**
     * Short for `font-weight` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  fw?: CSS.Properties['fontWeight'];

  /**
     * Short for `font-family` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  ff?: CSS.Properties['fontFamily'];

  /**
     * Short for `line-height` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  lh?: CSS.Properties<TLength>['lineHeight'];

  /**
     * Short for `box-sizing` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  bxz?: CSS.Properties['boxSizing'];

  /**
     * Short for `cursor` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  cur?: CSS.Properties['cursor'];

  /**
     * Short for `overflow` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  ov?: CSS.Properties['overflow'];

  /**
     * Short for `position` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  pos?: CSS.Properties['position'];

  /**
     * Short for `list-style` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  ls?: CSS.Properties['listStyle'];

  /**
     * Short for `text-align` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  ta?: CSS.Properties['textAlign'];

  /**
     * Short for `text-decoration` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  td?: CSS.Properties<TLength>['textDecoration'];

  /**
     * Short for `float` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  fl?: CSS.Properties['float'];

  /**
     * Short for `width` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  w?: CSS.Properties<TLength>['width'];

  /**
     * Short for `min-width` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  minW?: CSS.Properties<TLength>['minWidth'];

  /**
     * Short for `max-width` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  maxW?: CSS.Properties<TLength>['maxWidth'];

  /**
     * Short for `min-height` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  minH?: CSS.Properties<TLength>['minHeight'];

  /**
     * Short for `max-height` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  maxH?: CSS.Properties<TLength>['maxHeight'];

  /**
     * Short for `height` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  h?: CSS.Properties<TLength>['height'];

  /**
     * Short for `transition` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  trs?: CSS.Properties['transition'];

  /**
     * Short for `outline` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  out?: CSS.Properties<TLength>['outline'];

  /**
     * Short for `visibility` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  vis?: CSS.Properties['visibility'];

  /**
     * Short for `word-wrap` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  ww?: CSS.Properties['wordWrap'];

  /**
     * Short for `content` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  con?: CSS.Properties['content'];

  /**
     * Short for `z-index` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  z?: CSS.Properties['zIndex'];

  /**
     * Short for `transform` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  tr?: CSS.Properties['transform'];
}

export interface CssProps extends CSS.Properties, CSS.PropertiesHyphen, Atoms {}

export interface CssLikeObject extends CssProps {
  [selector: string]: any | CssLikeObject;
}

export type TDynamicCss = (css: CssLikeObject) => string;
export type THyperstyleElement = object;
export type THyperstyle = (...args) => THyperstyleElement;
export type THyperscriptType = string | Function;
export type THyperscriptComponent = Function;

export interface RuleAddon {
  /**
     * You need to install `rule` addon to add this method.
     *
     * ```js
     * import {create} from 'nano-css';
     * import {addon as addonRule} from 'nano-css/addon/rule';
     *
     * const nano = create();
     * addonRule(nano);
     *
     * const className = nano.rule({
     *   color: 'red',
     * });
     * ```
     *
     * @param css [CSS-like object](https://github.com/streamich/nano-css/blob/master/docs/put.md#css-like-object).
     * @param block Optional semantic name of this rule, must be unique.
     */
  rule: (css: CssLikeObject, block?: string) => string;
}

// import {CSSOMAddon} from './cssom';
// import {Css} from './vcssom/cssToTree';

export interface Css {
  [key: string]: CssLikeObject[keyof CssLikeObject] | Css;
}

export interface Tree {
  [atRulePrelude: string]: {
    [selector: string]: {
      [property: string]: CssLikeObject;
    };
  };
}

// import {VCSSOMAddon} from '../addon/vcssom';
// import {CSSOMAddon} from '../addon/cssom';
// import {ComponentAddon} from '../addon/component';
// import {DecoratorAddon} from '../addon/decorator';
// import {EmmetAddon} from '../addon/emmet';
// import {SheetAddon} from '../addon/sheet';
// import {UnitsAddon} from '../addon/units';
// import {KeyframesAddon} from '../addon/keyframes';
// import {AmpAddon} from '../addon/amp';
// import {ArrayAddon} from '../addon/array';
// import {CacheAddon} from '../addon/cache';
// import {DruleAddon} from '../addon/drule';
// import {DsheetAddon} from '../addon/dsheet';
// import {ExtractAddon} from '../addon/extract';
// import {GlobalAddon} from '../addon/global';
// import {GoogleFontAddon} from '../addon/googleFont';
// import {HydrateAddon} from '../addon/hydrate';

export type Addons =
  & RuleAddon
  & CSSOMAddon
  & VCSSOMAddon;
//  &
// SheetAddon &
// ComponentAddon &
// UnitsAddon &
// KeyframesAddon &
// DecoratorAddon &
// EmmetAddon &
// ArrayAddon &
// CacheAddon &
// DruleAddon &
// DsheetAddon &
// ExtractAddon &
// GlobalAddon &
// GoogleFontAddon &
// HydrateAddon &
// AmpAddon;

export interface NanoRenderer extends Partial<Addons> {
  /**
     * Equals to `true` if in browser environment.
     */
  client: boolean;

  /**
     * Raw CSS string. Populated in non-browser environment. Can be used to
     * render CSS server side.
     */
  raw: string;

  /**
     * Prefix to add to all class names and keyframe names.
     */
  pfx: string;

  /**
     * Add raw CSS rule. Example:
     *
     * ```js
     * nano.putRaw(`
     * .foo {
     *   color: red;
     * }
     * `);
     * ```
     */
  putRaw: (rawCss: string) => void;

  /**
     * Inject CSS given a selector and a CSS-like object.
     *
     * ```js
     * nano.put('.foo', {
     *     color: 'red',
     * });
     * ```
     *
     * Supports basic nesting.
     *
     * ```js
     * nano.put('.bar', {
     *     color: 'red',
     *     ':hover': {
     *         color: 'blue',
     *     },
     * });
     * ```
     */
  put: (selector: string, css: CssLikeObject, atrule?: string) => void;
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

export interface VCSSOMAddon {
  VRule: new (selector: string, mediaQuery?: string) => VRule;
  VSheet: new () => VSheet;
}
