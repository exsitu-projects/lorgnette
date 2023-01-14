import { Label } from "@blueprintjs/core";
import React, { Component, ReactElement } from "react";
import { FormContext, FormContextData } from "../FormContext";
import { FormEntryType, FormEntryOfType, FormEntryValueOfType, FormEntryKey, formEntryHasType } from "../FormEntry";

export type FormElementValueChangeListener<T extends FormEntryType> =
    (newValue: FormEntryValueOfType<T>) => void;

export interface FormElementProps<T extends FormEntryType> {
    formEntryKey: FormEntryKey;
    label?: string;
};

export interface FormElementState<T extends FormEntryType> {

};

export abstract class FormElement<
    T extends FormEntryType,
    P extends FormElementProps<T> = FormElementProps<T>,
    S extends FormElementState<T> = FormElementState<T>
> extends Component<P, S> {
    protected abstract readonly supportedFormEntryTypes: T[];

    protected get hasLabel(): boolean {
        return this.props.label !== undefined;
    }

    // Get a form entry that matches the key and the supported types of the form element, or null if there is none.
    protected getFormEntryFromContext(contextData: FormContextData): FormEntryOfType<T> | null {
        const formEntry = contextData.formEntries.find(entry => entry.key === this.props.formEntryKey);

        if (!formEntry) {
            console.log(`There is no form entry for key "${this.props.formEntryKey}".`);
            return null;
        }

        if (!formEntryHasType(formEntry, this.supportedFormEntryTypes)) {
            console.log(`The type of the form entry with key "${this.props.formEntryKey}" (${formEntry.type}) is not supported: expected ${this.supportedFormEntryTypes.join(" or ")}.`);
            return null;
        }
        
        return formEntry;
    }

    // protected shouldRender(formEntry: FormEntryOfType<T>): boolean {
    //     return true;
    // }

    abstract renderControl(
        formEntry: FormEntryOfType<T>,
        declareValueChange: (newValue: FormEntryValueOfType<T>) => void
    ): ReactElement;

    private renderControlWithLabel(
        formEntry: FormEntryOfType<T>,
        declareValueChange: (newValue: FormEntryValueOfType<T>) => void
    ): ReactElement {
        return <Label>
            <span className="label-text">{ this.props.label }</span>
            { this.renderControl(formEntry, declareValueChange) }
        </Label>;
    }

    private renderWithinContext(context: FormContextData): ReactElement | null {
        const formEntry = this.getFormEntryFromContext(context);
        if (formEntry) {
            const declareValueChange = (newValue: FormEntryValueOfType<T>) => context.declareFormEntryValueChange(formEntry, newValue);
            return this.hasLabel
                ? this.renderControlWithLabel(formEntry, declareValueChange)
                : this.renderControl(formEntry, declareValueChange)
        }

        return null;
    }

    render(): ReactElement {
        return <FormContext.Consumer>{ context =>
            this.renderWithinContext(context)
        }</FormContext.Consumer>
    }
}