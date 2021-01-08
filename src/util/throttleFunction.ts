export function throttleFunction<T extends (...args: any[]) => any>(
    fn: T,
    threshhold: number = 250,
    scope?: any,
) {
    threshhold || (threshhold = 250)
    let last: number, deferTimer: NodeJS.Timeout | number
    return function () {
        var context: Window | any = scope || window // this was actually "this"

        var now = +new Date(),
            args: any[] = arguments as any
        if (last && now < last + threshhold) {
            // hold on to it
            clearTimeout(deferTimer as any)
            deferTimer = setTimeout(function () {
                last = now
                fn.apply(context, args)
            }, threshhold)
        } else {
            last = now
            fn.apply(context, args)
        }
    } as T
}

