
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




// Add all the properties in the source to the target.
export function extend(target: Object, source: Object) {
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            target[key] = source[key]
        }
    }
}



// Lop off the first occurence of the reference in the Array.
export function removeFirst<T>(array: Array<T>, item: T): void {
    const idx = array.indexOf(item)
    idx !== -1 && array.splice(idx, 1)
}

type Color = {
    r: number,
    g: number,
    b: number,
}

const colorCache = {}
/**
 * Converts a hex-formatted color string to its rgb-formatted equivalent. Handy
 * when performing color tweening animations
 * @public
 * @param colorString A hex-formatted color string
 * @return An rgb-formatted color string
 */
export function hexToRGB(colorString: string): Color {
    if (colorCache[colorString]) {
        return colorCache[colorString]
    }
    let normalizedColor = colorString.replace('#', '')
    if (normalizedColor.length === 3) {
        normalizedColor =
            normalizedColor[0] +
            normalizedColor[0] +
            normalizedColor[1] +
            normalizedColor[1] +
            normalizedColor[2] +
            normalizedColor[2]
    }
    const parts = normalizedColor.match(/.{2}/g)
    if (!parts || parts.length < 3) {
        throw new Error('Expected a color string of format #rrggbb')
    }

    const ret: Color = {
        r: parseInt(parts[0], 16),
        g: parseInt(parts[1], 16),
        b: parseInt(parts[2], 16),
    }

    colorCache[colorString] = ret
    return ret
}

/**
 * Converts a rgb-formatted color string to its hex-formatted equivalent. Handy
 * when performing color tweening animations
 * @public
 * @param colorString An rgb-formatted color string
 * @return A hex-formatted color string
 */
export function rgbToHex(rNum: number, gNum: number, bNum: number): string {
    let r = rNum.toString(16)
    let g = gNum.toString(16)
    let b = bNum.toString(16)
    r = r.length < 2 ? '0' + r : r
    g = g.length < 2 ? '0' + g : g
    b = b.length < 2 ? '0' + b : b
    return '#' + r + g + b
}