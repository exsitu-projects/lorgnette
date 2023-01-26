type NotFunction<T> = T extends Function ? never : T;
type NotFunctionNorNullable<T> = NotFunction<T> & NonNullable<T>;

/**
 * A condition on a value that can be represented by either:
 * 
 * - a single value that (true if the other value is equal);
 * - a list of values (true if the other value is in the list);
 * - an assertion function (true if it returns true when given another value).
 * 
 * Note that the type of a single value T cannot be a function nor nullable.
 */
export type ValueCondition<T> =
    | NotFunctionNorNullable<T>
    | T[]
    | ((value: T) => boolean);

/** Evaluate whether the giben condition is true for the given value. */
export function evaluateCondition<T>(condition: ValueCondition<T>, value: T): boolean {
    if (condition instanceof Function) {
        return condition(value);
    }
    else if (Array.isArray(condition)) {
        return condition.includes(value);
    }
    else {
        return value === condition;
    }
}
