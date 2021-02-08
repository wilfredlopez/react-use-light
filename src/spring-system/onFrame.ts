declare global {
    interface Window {
        mozRequestAnimationFrame: typeof requestAnimationFrame
        msRequestAnimationFrame: typeof requestAnimationFrame
        oRequestAnimationFrame: typeof requestAnimationFrame
    }

}
let _onFrame
if (typeof window !== 'undefined') {
    _onFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame
}

if (!_onFrame && typeof process !== 'undefined' && process.title === 'node') {
    _onFrame = setImmediate
}

_onFrame =
    _onFrame ||
    function (callback: () => any) {
        window.setTimeout(callback, 1000 / 60)
    }

export default _onFrame