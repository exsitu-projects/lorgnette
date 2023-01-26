type NotFunction<T> = T extends Function ? never : T;

/**
 * An object that can be turned into a value that can either be:
 * - a value of type T;
 * - a function that returns a value of type T given a context of type C.
 * 
 * Note that the type of a single value T cannot be a function.
 */
export type Valuable<T, C = undefined> =
    | NotFunction<T>
    | ((parameter: C) => T);

/** Evaluate the given valuable within the given context. */
export function evaluate<T>(valuable: Valuable<T, undefined>): T;
export function evaluate<T, C>(valuable: Valuable<T, C>, context: C): T;
    export function evaluate<T, C = undefined>(valuable: Valuable<T, C>, context?: C): T {
    if (valuable instanceof Function) {
        return valuable(context!);
    }
    else {
        return valuable;
    }
}
