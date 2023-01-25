import React from "react";
import { FormEntry, FormEntryOfType, FormEntryType, FormEntryValueOfType } from "./FormEntry";

export interface FormContextData {
    formEntries: FormEntry[];

    beginTransientEdit(): void;
    endTransientEdit(): void;

    declareFormEntryValueChange<T extends FormEntryType>(
        formEntry: FormEntryOfType<T>,
        newValue: FormEntryValueOfType<T>
    ): void;
}

export const FormContext = React.createContext<FormContextData>({
    formEntries: [],
    beginTransientEdit: () => {},
    endTransientEdit: () => {},
    declareFormEntryValueChange: () => {}
});
