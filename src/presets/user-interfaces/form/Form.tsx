import "./form.css";
import React, { ReactElement } from "react";
import { Projection } from "../../../core/projections/Projection";
import { UserInterface, UserInterfaceInput, UserInterfaceOutput } from "../../../core/user-interfaces/UserInterface";
import { FormContext, FormContextData } from "./FormContext";
import { FormEntry, FormEntryKey, FormEntryOfType, FormEntryType, FormEntryValueOfType } from "./FormEntry";
import { ConfigurableUserInterfaceProvider, UserInterfaceProvider } from "../../../core/user-interfaces/UserInterfaceProvider";
import { FormSettings, deriveFormSettingsFrom } from "./FormSettings";

export type FormData = FormEntry[];

export type FormDataChange = FormData;

export interface Input extends UserInterfaceInput {
    data: FormData;
};

export interface Output extends UserInterfaceOutput {
    data: FormData;
    modifiedData: FormData;
};

export abstract class Form extends UserInterface<Input, Output> {
    readonly className = "form";

    private formEntries: FormData;
    private modifiedFormEntries: FormDataChange;

    constructor(projection: Projection) {
        super(projection);

        this.formEntries = [];
        this.modifiedFormEntries = [];
    }

    protected get modelOutput(): Output {
        return {
            data: this.formEntries,
            modifiedData: this.modifiedFormEntries ?? []
        };
    }
    
    protected get formContextData(): FormContextData {
        return {
            formEntries: this.formEntries,

            beginTransientEdit: () => {
                this.beginTransientState();
            },

            endTransientEdit: () => {
                this.endTransientState();
                this.declareModelChange();
            },

            declareFormEntryValueChange: <T extends FormEntryType>(
                formEntryKey: FormEntryKey,
                newValue: FormEntryValueOfType<T>,
                newValueType: T
            ) => {
                const entryToModify = this.formEntries.find(entry => entry.key === formEntryKey);

                // Case 1: the form entry already exists and should be modified.
                if (entryToModify) {
                    entryToModify.value = newValue;
                    this.modifiedFormEntries.push(entryToModify);
                }
                // Case 2: the form entry does not exist yet and must be created
                // (e.g., when the form element was created using a default value).
                else {
                    const newFormEntry = {
                        type: newValueType,
                        key: formEntryKey,
                        value: newValue
                    } as FormEntryOfType<T>;

                    this.formEntries.push(newFormEntry);
                    this.modifiedFormEntries.push(newFormEntry);
                }

                this.declareModelChange();
            }
        };
    }

    protected processInput(input: Input): void {
        this.formEntries = input.data;
    }

    protected abstract createFormBody(): ReactElement; 

    createViewContent(): ReactElement {
        return <FormContext.Provider value={this.formContextData}>
            { this.createFormBody() }
        </FormContext.Provider>;
    }

    static makeConfigurableProvider(): ConfigurableUserInterfaceProvider {
        return (settings: Partial<FormSettings> = {}) => {
            const content = deriveFormSettingsFrom(settings).content;
            return {
                provide: (projection: Projection) => {
                    return new (class extends Form {
                        protected createFormBody(): React.ReactElement {
                            return content;
                        }
                    })(projection);
                }
            };  
        };
    }
}