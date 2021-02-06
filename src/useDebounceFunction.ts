import { DependencyList, useMemo } from "react"
import { debounceFunction } from './util/debounceFunction'

interface DebounceOptions {
    leading?: number
    maxWait?: number
    trailing?: number
}
export default function useDebounceFunction<T extends (...args: any[]) => any>(
    fn: T,
    ms: number = 0,
    deps: DependencyList = [],
    options: DebounceOptions = {}
) {
    const func = useMemo(() => debounceFunction(fn, ms, options), [...deps, fn, ms, options])
    //eslint-disable-next-line
    return [func, func.cancel, func.pending] as const
}
