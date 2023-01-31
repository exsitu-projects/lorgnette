import React, { ReactElement } from "react";
import { NumericInput } from "@blueprintjs/core";
import { FormEntryType, FormEntryValueOfType } from "../FormEntry";
import { FormElement, FormElementProps, FormElementValueChangeListener } from "./FormElement";

type SupportedEntryTypes = FormEntryType.Number;

export interface NumberInputProps extends FormElementProps<SupportedEntryTypes> {
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
};

export class NumberInput extends FormElement<SupportedEntryTypes, NumberInputProps> {
    protected readonly supportedFormEntryTypes = [FormEntryType.Number] as SupportedEntryTypes[];

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
        return <NumericInput
            defaultValue={value}
            onValueChange={newValue => declareValueChange(newValue, this.supportedFormEntryTypes[0])}
            onFocus={event => beginTransientState()}
            onBlur={event => endTransientState()}
            min={this.props.min}
            max={this.props.max}
            stepSize={this.props.step}
            style={this.props.style}
        />
    };
}