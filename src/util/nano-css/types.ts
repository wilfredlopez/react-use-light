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
  d?: CSS.DisplayProperty;

  /**
     * Short for `margin` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  mar?: CSS.MarginProperty<TLength>;

  /**
     * Short for `margin-top` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  mart?: CSS.MarginBottomProperty<TLength>;

  /**
     * Short for `margin-right` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  marr?: CSS.MarginBottomProperty<TLength>;

  /**
     * Short for `margin-bottom` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  marb?: CSS.MarginBottomProperty<TLength>;

  /**
     * Short for `margin-left` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  marl?: CSS.MarginBottomProperty<TLength>;

  /**
     * Short for `padding` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  pad?: CSS.PaddingProperty<TLength>;

  /**
     * Short for `padding-top` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  padt?: CSS.PaddingBottomProperty<TLength>;

  /**
     * Short for `padding-right` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  padr?: CSS.PaddingBottomProperty<TLength>;

  /**
     * Short for `padding-bottom` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  padb?: CSS.PaddingBottomProperty<TLength>;

  /**
     * Short for `padding-left` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  padl?: CSS.PaddingBottomProperty<TLength>;

  /**
     * Short for `border` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  bd?: CSS.BorderBottomProperty<TLength>;

  /**
     * Short for `border-top` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  bdt?: CSS.BorderBottomProperty<TLength>;

  /**
     * Short for `border-right` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  bdr?: CSS.BorderBottomProperty<TLength>;

  /**
     * Short for `border-bottom` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  bdb?: CSS.BorderBottomProperty<TLength>;

  /**
     * Short for `border-left` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  bdl?: CSS.BorderBottomProperty<TLength>;

  /**
     * Short for `border-radius` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  bdrad?: CSS.BorderRadiusProperty<TLength>;

  /**
     * Short for `color` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  col?: CSS.Color;

  /**
     * Short for `opacity` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  op?: number | string;

  /**
     * Short for `background` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  bg?: CSS.BackgroundProperty<TLength>;

  /**
     * Short for `background-color` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  bgc?: CSS.BackgroundColorProperty;

  /**
     * Short for `font-size` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  fz?: CSS.FontSizeProperty<TLength>;

  /**
     * Short for `font-style` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  fs?: CSS.FontStyleProperty;

  /**
     * Short for `font-weight` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  fw?: CSS.FontWeightProperty;

  /**
     * Short for `font-family` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  ff?: CSS.FontFamilyProperty;

  /**
     * Short for `line-height` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  lh?: CSS.LineHeightProperty<TLength>;

  /**
     * Short for `box-sizing` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  bxz?: CSS.BoxSizingProperty;

  /**
     * Short for `cursor` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  cur?: CSS.CursorProperty;

  /**
     * Short for `overflow` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  ov?: CSS.OverflowProperty;

  /**
     * Short for `position` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  pos?: CSS.PositionProperty;

  /**
     * Short for `list-style` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  ls?: CSS.ListStyleProperty;

  /**
     * Short for `text-align` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  ta?: CSS.TextAlignProperty;

  /**
     * Short for `text-decoration` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  td?: CSS.TextDecorationProperty<TLength>;

  /**
     * Short for `float` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  fl?: CSS.FloatProperty;

  /**
     * Short for `width` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  w?: CSS.WidthProperty<TLength>;

  /**
     * Short for `min-width` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  minW?: CSS.MinWidthProperty<TLength>;

  /**
     * Short for `max-width` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  maxW?: CSS.MaxWidthProperty<TLength>;

  /**
     * Short for `min-height` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  minH?: CSS.MinHeightProperty<TLength>;

  /**
     * Short for `max-height` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  maxH?: CSS.MaxHeightProperty<TLength>;

  /**
     * Short for `height` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  h?: CSS.HeightProperty<TLength>;

  /**
     * Short for `transition` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  trs?: CSS.TransitionProperty;

  /**
     * Short for `outline` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  out?: CSS.OutlineProperty<TLength>;

  /**
     * Short for `visibility` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  vis?: CSS.VisibilityProperty;

  /**
     * Short for `word-wrap` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  ww?: CSS.WordWrapProperty;

  /**
     * Short for `content` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  con?: CSS.ContentProperty;

  /**
     * Short for `z-index` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  z?: CSS.ZIndexProperty;

  /**
     * Short for `transform` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
  tr?: CSS.TransformProperty;
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
