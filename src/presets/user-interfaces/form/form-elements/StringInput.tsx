import React, { ReactElement } from "react";
import { InputGroup } from "@blueprintjs/core";
import { FormEntryType, FormEntryValueOfType } from "../FormEntry";
import { FormElement, FormElementProps, FormElementValueChangeListener } from "./FormElement";

type SupportedEntryTypes = FormEntryType.String;

export interface StringInputProps extends FormElementProps<SupportedEntryTypes> {
    defaultValue?: string;
};

export class StringInput extends FormElement<SupportedEntryTypes, StringInputProps> {
    protected readonly supportedFormEntryTypes = [FormEntryType.String] as SupportedEntryTypes[];

    protected renderControlWithoutValue(
        declareValueChange: FormElementValueChangeListener<SupportedEntryTypes>,
        beginTransientState: () => void,
        endTransientState: () => void
    ): ReactElement | null {
        const defaultValue = this.props.defaultValue;
        return defaultValue !== undefined
            ? this.renderControl(defaultValue, declareValueChange, beginTransientState, endTransientState)
            : null;
    }
    
    protected renderControl(
        value: FormEntryValueOfType<SupportedEntryTypes>,
        declareValueChange: FormElementValueChangeListener<SupportedEntryTypes>,
        beginTransientState: () => void,
        endTransientState: () => void
    ): ReactElement {
        return <InputGroup
            defaultValue={value}
            style={this.props.style}
            onChange={event => declareValueChange(event.target.value, this.supportedFormEntryTypes[0])}
            onFocus={event => beginTransientState()}
            onBlur={event => endTransientState()}
        />;
    };
}