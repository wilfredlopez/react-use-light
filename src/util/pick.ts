/**
 * Avoid extra data in objects by picking only the keys that are needed.
 * @param obj Object to pick from
 * @param keys keys of the object that you want to pick
 * @returns
 */
export function pick<T extends {}, D extends (keyof T)>(obj: T, keys: D[]): Pick<T, D> {
    const pt: Partial<T> = {}
    for (const key of keys) {
        pt[key] = obj[key]
    }
    return pt as Pick<T, D>
}
