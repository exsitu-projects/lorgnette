import React, { ReactElement } from "react";
import { NumericInput, NumericInputProps } from "@blueprintjs/core";
import { FormEntryOfType, FormEntryType, FormEntryValueOfType } from "../FormEntry";
import { FormElement, FormElementProps } from "./FormElement";

type SupportedEntryTypes = FormEntryType.Number;

export interface NumberInputProps extends FormElementProps<SupportedEntryTypes> {
    min?: number;
    max?: number;
    step?: number;
};

export class NumberInput extends FormElement<SupportedEntryTypes, NumberInputProps> {
    protected readonly supportedFormEntryTypes = [FormEntryType.Number] as SupportedEntryTypes[];

    private get inputConfigurationProps(): Partial<NumericInputProps> {
        return {
            min: this.props.min,
            max: this.props.max,
            stepSize: this.props.step
        };
    }

    renderControl(
        formEntry: FormEntryOfType<SupportedEntryTypes>,
        declareValueChange: (newValue: FormEntryValueOfType<SupportedEntryTypes>) => void,
        beginTransientState: () => void,
        endTransientState: () => void
    ): ReactElement {
        return <NumericInput
            defaultValue={formEntry.value}
            style={this.props.style}
            onValueChange={newValue => declareValueChange(newValue)}
            onFocus={event => beginTransientState()}
            onBlur={event => endTransientState()}
            {...this.inputConfigurationProps}
        />
    };
}