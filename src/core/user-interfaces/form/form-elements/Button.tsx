import React, { ReactElement } from "react";
import { Button as BlueprintsButton } from "@blueprintjs/core";
import { FormEntryType, FormEntryValueOfType } from "../FormEntry";
import { AnyEntryTypeSymbol, ANY_ENTRY_TYPES, FormElement, FormElementProps, FormElementValueChangeListener } from "./FormElement";
import { evaluateCondition, ValueCondition } from "../../../../utilities/ValueCondition";
import { evaluate, Valuable } from "../../../../utilities/Valuable";

type SupportedEntryTypes = FormEntryType;

export interface ButtonProps<T extends SupportedEntryTypes> extends FormElementProps<T> {
    text: Valuable<string | ReactElement, FormEntryValueOfType<T> | null>;
    valueWithType: Valuable<[FormEntryValueOfType<T>, T], FormEntryValueOfType<T> | null>;
    activateOn?: ValueCondition<FormEntryValueOfType<T> | null>;
    disableOn?: ValueCondition<FormEntryValueOfType<T> | null>;
    showWithoutValue?: boolean;
};

export class Button<T extends SupportedEntryTypes> extends FormElement<SupportedEntryTypes, ButtonProps<T>> {
    protected readonly supportedFormEntryTypes: AnyEntryTypeSymbol = ANY_ENTRY_TYPES;

    protected isButtonActive(value: FormEntryValueOfType<T> | null): boolean {
        return evaluateCondition(
            this.props.activateOn ?? (() => false),
            value
        );
    }

    protected isButtonDisabled(value: FormEntryValueOfType<T> | null): boolean {
        return evaluateCondition(
            this.props.disableOn ?? (() => false),
            value
        );
    }

    protected renderControlWithoutValue(
        declareValueChange: FormElementValueChangeListener<SupportedEntryTypes>
    ): ReactElement | null {
        return this.props.showWithoutValue
            ? this.renderControl(null, declareValueChange)
            : null;
    }

    protected renderControl(
        value: FormEntryValueOfType<SupportedEntryTypes> | null,
        declareValueChange: FormElementValueChangeListener<SupportedEntryTypes>
    ): ReactElement {
        return <BlueprintsButton
            text={evaluate(this.props.text, value)}
            active={this.isButtonActive(value)}
            disabled={this.isButtonDisabled(value)}
            style={this.props.style}
            onClick={event => declareValueChange(...evaluate(this.props.valueWithType, value))}
        />;
    };
}
