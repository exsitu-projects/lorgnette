export type ClassOf<T> = { new(...args: any[]): T };

// Adapted from https://stackoverflow.com/a/43001581
export type DeepOptionalProperties<T> = {
    [P in keyof T]+?:
        T[P] extends Array<any>
            ? T[P]
            : DeepOptionalProperties<T[P]>
};
