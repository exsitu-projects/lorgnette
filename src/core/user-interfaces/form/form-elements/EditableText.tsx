import React, { ReactElement } from "react";
import { EditableText as BlueprintEditableText } from "@blueprintjs/core";
import { FormEntryType, FormEntryValueOfType } from "../FormEntry";
import { FormElement, FormElementProps, FormElementValueChangeListener } from "./FormElement";

type SupportedEntryTypes = FormEntryType.String;

export interface EditableTextProps extends FormElementProps<SupportedEntryTypes> {
    defaultValue?: string;
    multiline?: boolean;
};

export class EditableText extends FormElement<SupportedEntryTypes, EditableTextProps> {
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
        return <BlueprintEditableText
            defaultValue={value}
            onChange={newValue => declareValueChange(newValue, this.supportedFormEntryTypes[0])}
            onEdit={value => {
                beginTransientState();
            }}
            onConfirm={newValue => {
                // declareValueChange(newValue, this.supportedFormEntryTypes[0])
                endTransientState();
            }}
            onCancel={oldValue => {
                // declareValueChange(oldValue, this.supportedFormEntryTypes[0])
                endTransientState();
            }}
        />;
    };
}
