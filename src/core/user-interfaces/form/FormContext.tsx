import React from "react";
import { FormEntry, FormEntryOfType, FormEntryType, FormEntryValueOfType } from "./FormEntry";

export interface FormContextData {
    formEntries: FormEntry[];

    declareFormEntryValueChange<T extends FormEntryType>(
        formEntry: FormEntryOfType<T>,
        newValue: FormEntryValueOfType<T>
    ): void;
}

export const FormContext = React.createContext<FormContextData>({
    formEntries: [],
    declareFormEntryValueChange: () => {}
});
