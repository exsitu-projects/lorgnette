import React from "react";
import { FormEntry, FormEntryKey, FormEntryType, FormEntryValueOfType } from "./FormEntry";

export interface FormContextData {
    formEntries: FormEntry[];

    beginTransientEdit(): void;
    endTransientEdit(): void;

    declareFormEntryValueChange<T extends FormEntryType>(
        formEntryKey: FormEntryKey,
        newValue: FormEntryValueOfType<T>,
        newValueType: T
    ): void;
}

export const FormContext = React.createContext<FormContextData>({
    formEntries: [],
    beginTransientEdit: () => {},
    endTransientEdit: () => {},
    declareFormEntryValueChange: () => {}
});
