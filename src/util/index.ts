import { isDeepEqualReact } from "./isDeepEqualReact"

export const isClient = typeof window === "object"

export const on = (obj: any, ...args: any[]) => obj.addEventListener(...args)

export const off = (obj: any, ...args: any[]) =>
    obj.removeEventListener(...args)


export const isDeepEqual: (a: any, b: any) => boolean = isDeepEqualReact
export { pick } from './pick'

export { throttleFunction } from './throttleFunction'
export { debounceFunction } from './debounceFunction'
export * from './ErrorBoundary'