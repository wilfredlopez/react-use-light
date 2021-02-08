
import { hexToRGB, rgbToHex } from './util'

export function mapValueInRange(
    value: number,
    fromLow: number,
    fromHigh: number,
    toLow: number,
    toHigh: number,
): number {
    const fromRangeSize = fromHigh - fromLow
    const toRangeSize = toHigh - toLow
    const valueScale = (value - fromLow) / fromRangeSize
    return toLow + valueScale * toRangeSize
}

/**
 * Interpolate two hex colors in a 0 - 1 range or optionally provide a
 * custom range with fromLow,fromHight. The output will be in hex by default
 * unless asRGB is true in which case it will be returned as an rgb string.
 *
 * @public
 * @param asRGB Whether to return an rgb-style string
 * @return A string in hex color format unless asRGB is true, in which case a string in rgb format
 */
export function interpolateColor(
    val: number,
    startColorStr: string,
    endColorStr: string,
    fromLow: number = 0,
    fromHigh: number = 1,
    asRGB = false,
): string {
    const startColor = hexToRGB(startColorStr)
    const endColor = hexToRGB(endColorStr)
    const r = Math.floor(
        mapValueInRange(val, fromLow, fromHigh, startColor.r, endColor.r),
    )
    const g = Math.floor(
        mapValueInRange(val, fromLow, fromHigh, startColor.g, endColor.g),
    )
    const b = Math.floor(
        mapValueInRange(val, fromLow, fromHigh, startColor.b, endColor.b),
    )
    if (asRGB) {
        return 'rgb(' + r + ',' + g + ',' + b + ')'
    } else {
        return rgbToHex(r, g, b)
    }
}

export function degreesToRadians(deg: number): number {
    return deg * Math.PI / 180
}

export function radiansToDegrees(rad: number): number {
    return rad * 180 / Math.PI
}