
/**
 * Detect the indexes of a Readonly Array
 */
export type IndexOf<T extends ReadonlyArray<any>, S extends number[] = []> =
    T['length'] extends S['length'] ? S[number] : IndexOf<T, [S['length'], ...S]>



/**
 * Detect keys of an object that are functions
 */
export type FunctionKeys<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]
export type SubSet<A extends {}, B extends {}> = {
    [P in keyof B]: P extends keyof A ? (B[P] extends A[P] | undefined ? A[P] : never) : never
}

/**
 * Make Strict restringtion over the type
 * @example
 * function createUserStrict<T extends Strict<User, T>>(user: T) {}
 */
export type Strict<A extends {}, B extends {}> = SubSet<A, B> & SubSet<B, A>



/*--------------
 *   TESTS
 -------------*/

// interface User {
//     name: string
//     age: number
//     getName(): string
// }
// const user = {
//     name: 'wilfred',
//     getName() {
//         return this.name
//     },
//     age: 32,
//     mmag: 111,
//     badCode: 'script...'
// }

// type IndexOfA = IndexOf<typeof a>

// function createUser(potentialUser: User) {
//     //save user to db only picking the necesary properties
//     const user: User = pick(potentialUser, ['age', 'name', 'getName'])
//     const name = user.getName()
//     const userFuncs = getFunctions(user)
//     const oneFunc = pickFunctions(user, ['getName'])
//     userFuncs.getName()
//     oneFunc.getName()
//     console.log({ user, name })
// }
// const validUser = {
//     name: 'n',
//     getName() {
//         return this.name
//     },
//     age: 1
// }
// function createUserStrict<T extends Strict<User, T>>(user: T) {

// }
// //Strict<User, T>
// //can add if has other properties
// createUser(user)
// //can only add if the type is User
// createUserStrict(validUser)
// //@ts-expect-error
// createUserStrict(user)

// const a = ['wilfred', 'yanna', 'theudy', 'austria', 'catalina', 'wilbert'] as const


// function getAAtIndex<T extends IndexOfA>(index: T): typeof a[T] {
//     return a[index]
// }
// function getAAtIndex_Bad<T extends number>(index: T): typeof a[T] {
//     return a[index]
// }

// //TYPESCRIPT IS GREAT!!!!!!
// const wilfred = getAAtIndex(0)
// const unknown = getAAtIndex_Bad(0)
// const yanna = getAAtIndex(1)



// function pickFunctions<T extends {}, D extends FunctionKeys<T>>(obj: T, keys: D[]): Pick<T, FunctionKeys<T>> {
//     const pt: Partial<T> = {}
//     for (const k of keys) {
//         const fn = obj[k]
//         if (typeof fn === 'function') {
//             pt[k] = fn
//         }
//     }
//     return pt as Pick<T, FunctionKeys<T>>
// }
// function getFunctions<T extends {}>(obj: T): Pick<T, FunctionKeys<T>> {
//     const pt: any = {}
//     for (const k in obj) {
//         const fn = obj[k]
//         if (typeof fn === 'function') {
//             pt[k] = fn
//         }
//     }
//     return pt as Pick<T, FunctionKeys<T>>
// }











