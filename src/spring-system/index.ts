
import * as utilities from './util'
import * as MathUtil from './MathUtil'

export * as OrigamiValueConverter from './OrigamiValueConverter'
export * as Loopers from './Loopers'
export * as SpringConfig from './SpringConfig'
export { default as SpringSystem } from './SpringSystem'
export { default as Spring } from './Spring'

const util = {
    ...utilities,
    ...MathUtil,
}
const rgbToHex = util.rgbToHex
const degreesToRadians = util.degreesToRadians
const hexToRGB = util.hexToRGB
const interpolateColor = util.interpolateColor
const radiansToDegrees = util.radiansToDegrees
const removeFirst = util.removeFirst

export { MathUtil, util, rgbToHex, degreesToRadians, hexToRGB, interpolateColor, radiansToDegrees, removeFirst }
