import React, { ReactElement } from "react";
import { Button as BlueprintsButton, ButtonProps as BlueprintsButtonProps } from "@blueprintjs/core";
import { FormEntryOfType, FormEntryType, FormEntryValueOfType } from "../FormEntry";
import { AnyEntryTypeSymbol, ANY_ENTRY_TYPES, FormElement, FormElementProps } from "./FormElement";
import { evaluateCondition, ValueCondition } from "../../../../utilities/ValueCondition";
import { evaluate, Valuable } from "../../../../utilities/Valuable";

type SupportedEntryTypes = FormEntryType;

export interface ButtonProps<T extends SupportedEntryTypes> extends FormElementProps<T> {
    text: Valuable<string | ReactElement, FormEntryValueOfType<T>>;
    value: Valuable<FormEntryValueOfType<T>, FormEntryValueOfType<T>>;
    activateOn?: ValueCondition<FormEntryValueOfType<T>>;
    disableOn?: ValueCondition<FormEntryValueOfType<T>>;
};

export class Button<T extends SupportedEntryTypes> extends FormElement<SupportedEntryTypes, ButtonProps<T>> {
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
        const buttonIsActive = evaluateCondition(
            this.props.activateOn ?? (() => false),
            formEntry.value
        );

        const buttonIsDisabled = evaluateCondition(
            this.props.disableOn ?? (() => false),
            formEntry.value
        );

        return <BlueprintsButton
            text={evaluate(this.props.text, formEntry.value)}
            active={buttonIsActive}
            disabled={buttonIsDisabled}
            style={this.props.style}
            onClick={event => declareValueChange(evaluate(this.props.value, formEntry.value))}
            {...this.inputConfigurationProps}
        />
    };
}
