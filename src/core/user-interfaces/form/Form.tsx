import "./form.css";
import React, { ReactElement } from "react";
import { Monocle } from "../../monocles/Monocle";
import { UserInterface, UserInterfaceInput, UserInterfaceOutput } from "../UserInterface";
import { FormContext, FormContextData } from "./FormContext";
import { FormEntry } from "./FormEntry";
import { UserInterfaceProvider } from "../UserInterfaceProvider";

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

    private data: FormData;
    private lastDataChange: FormDataChange | null;

    constructor(monocle: Monocle) {
        super(monocle);

        this.data = [];
        this.lastDataChange = [];
    }

    protected get modelOutput(): Output {
        return {
            data: this.data,
            modifiedData: this.lastDataChange ?? []
        };
    }
    
    protected get formContextData(): FormContextData {
        return {
            formEntries: this.data,

            declareFormEntryValueChange: (formEntry, newValue) => {
                const entryToModify = this.data.find(entry => entry.key === formEntry.key);
                if (entryToModify) {
                    entryToModify.value = newValue;
                    this.lastDataChange = [entryToModify];

                    this.declareModelChange()
                }
            }
        };
    }


    updateModel(input: Input): void {
        this.data = input.data;
    }

    protected abstract createFormBody(): ReactElement; 

    createViewContent(): ReactElement {
        return <FormContext.Provider value={this.formContextData}>
            { this.createFormBody() }
        </FormContext.Provider>;
    }

    static makeProvider(formBody: ReactElement): UserInterfaceProvider {
        const concreteFormUserInterface = class extends Form {
            protected createFormBody(): React.ReactElement<any, string | React.JSXElementConstructor<any>> {
                return formBody;
            }
        };

        return {
            provideForMonocle: (monocle: Monocle): UserInterface<Input, Output> => {
                return new concreteFormUserInterface(monocle);
            }
        };
    }
}