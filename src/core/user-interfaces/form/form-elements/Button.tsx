import React, { ReactElement } from "react";
import { Button as BlueprintsButton, ButtonProps as BlueprintsButtonProps } from "@blueprintjs/core";
import { FormEntryOfType, FormEntryType, FormEntryValue, FormEntryValueOfType } from "../FormEntry";
import { AnyEntryTypeSymbol, ANY_ENTRY_TYPES, FormElement, FormElementProps } from "./FormElement";

type SupportedEntryTypes = FormEntryType;

export interface ButtonProps extends FormElementProps<SupportedEntryTypes> {
    text: string | ReactElement;
    value: FormEntryValue
};

export class Button extends FormElement<SupportedEntryTypes, ButtonProps> {
    protected readonly supportedFormEntryTypes: AnyEntryTypeSymbol = ANY_ENTRY_TYPES;

    private get inputConfigurationProps(): Partial<BlueprintsButtonProps> {
        return {
            
        };
    }

    renderControl(
        formEntry: FormEntryOfType<SupportedEntryTypes>,
        declareValueChange: (newValue: FormEntryValueOfType<SupportedEntryTypes>) => void,
        beginTransientState: () => void,
        endTransientState: () => void
    ): ReactElement {
        return <BlueprintsButton
            text={this.props.text}
            style={this.props.style}
            onClick={event => declareValueChange(this.props.value)}
            {...this.inputConfigurationProps}
        />
    };
}
