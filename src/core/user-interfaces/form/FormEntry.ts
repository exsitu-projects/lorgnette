export type FormEntryKey = string | number;

export const enum FormEntryType {
    Boolean = "Boolean",
    Number = "Number",
    String = "String",
    StringList = "StringList"
};

export type FormEntry =
    {
        type: FormEntryType.Boolean,
        key: FormEntryKey,
        value: boolean
    } | {
        type: FormEntryType.Number,
        key: FormEntryKey,
        value: number
    } | {
        type: FormEntryType.String,
        key: FormEntryKey,
        value: string
    } | {
        type: FormEntryType.StringList,
        key: FormEntryKey,
        value: string,
        valueOptions: string[]
    };

// Utility type used to implement other types.
// It maps a form entry type (from the enumeration above) to the related form entry.
type FormEntryTypesToFormEntries = { [K in FormEntryType]: Extract<FormEntry, { type: K }> };

export type FormEntryOfType<T extends FormEntryType> = FormEntryTypesToFormEntries[T];
export type FormEntryValueOfType<T extends FormEntryType> = FormEntryOfType<T>["value"];

export function formEntryHasType<T extends FormEntryType>(
    formEntry: FormEntry,
    acceptedTypes: T[]
): formEntry is FormEntryOfType<T> {
    return (acceptedTypes as FormEntryType[]).includes(formEntry.type);
}