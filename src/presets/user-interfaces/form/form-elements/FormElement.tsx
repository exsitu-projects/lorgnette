import React, { Component, ReactElement } from "react";
import { FormContext, FormContextData } from "../FormContext";
import { FormEntryType, FormEntryOfType, FormEntryValueOfType, FormEntryKey, formEntryHasType } from "../FormEntry";
import { Label } from "./helpers/Label";

export type FormElementValueChangeListener<T extends FormEntryType> =
    (newValue: FormEntryValueOfType<T>, newValueType: T) => void;

export interface FormElementProps<T extends FormEntryType> {
    formEntryKey: FormEntryKey;
    label?: string;
    style?: React.CSSProperties;
};

export interface FormElementState<T extends FormEntryType> {

};

export const ANY_ENTRY_TYPES = Symbol("Any form element entry type");
export type AnyEntryTypeSymbol = typeof ANY_ENTRY_TYPES;

export abstract class FormElement<
    T extends FormEntryType,
    P extends FormElementProps<T> = FormElementProps<T>,
    S extends FormElementState<T> = FormElementState<T>
> extends Component<P, S> {
    protected abstract readonly supportedFormEntryTypes: T[] | AnyEntryTypeSymbol;

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

        if (this.supportedFormEntryTypes !== ANY_ENTRY_TYPES && !formEntryHasType(formEntry, this.supportedFormEntryTypes)) {
            console.log(`The type of the form entry with key "${this.props.formEntryKey}" (${formEntry.type}) is not supported: expected ${this.supportedFormEntryTypes.join(" or ")}.`);
            return null;
        }
        
        // The cast is required because the type is unknown (but does not matter)
        // if the form element supports all types using the ANY_ENTRY_TYPES symbol.
        return formEntry as FormEntryOfType<T>;
    }

    protected abstract renderControl(
        value: FormEntryValueOfType<T>,
        declareValueChange: FormElementValueChangeListener<T>,
        beginTransientState: () => void,
        endTransientState: () => void
    ): ReactElement | null;

    // By default, no control is rendered when there is no value.
    // This can be overridden by specific components.
    protected renderControlWithoutValue(
        declareValueChange: FormElementValueChangeListener<T>,
        beginTransientState: () => void,
        endTransientState: () => void
    ): ReactElement | null {
        return null;
    }

    private renderWithinContext(context: FormContextData): ReactElement | null {
        const declareValueChange = (newValue: FormEntryValueOfType<T>, newValueType: T) =>
            context.declareFormEntryValueChange(this.props.formEntryKey, newValue, newValueType);
        const beginTransientState = context.beginTransientEdit;
        const endTransientState = context.endTransientEdit;

        const formEntry = this.getFormEntryFromContext(context);
        const controlComponent = formEntry
            ? this.renderControl(formEntry.value as FormEntryValueOfType<T>, declareValueChange, beginTransientState, endTransientState)
            : this.renderControlWithoutValue(declareValueChange, beginTransientState, endTransientState);

        const label = this.props.label;
        return label
            ? Label.wrapNonEmptyComponentWithLabel(controlComponent, label)
            : controlComponent;
    }

    render(): ReactElement {
        return <FormContext.Consumer>{ context =>
            this.renderWithinContext(context)
        }</FormContext.Consumer>
    }
}