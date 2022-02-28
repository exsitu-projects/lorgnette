export type ClassOf<T> = { new(...args: any[]): T };

// Adapted from https://stackoverflow.com/a/43001581
export type DeepOptionalProperties<T> = {
    [P in keyof T]+?:
        T[P] extends Array<any>
            ? T[P]
            : DeepOptionalProperties<T[P]>
};

export type DeepRequiredProperties<T> = {
    [P in keyof Required<T>]-?:
        T[P] extends Array<any>
            ? T[P]
            : DeepRequiredProperties<T[P]>
};