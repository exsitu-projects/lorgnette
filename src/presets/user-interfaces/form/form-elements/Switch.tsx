import React, { ReactElement } from "react";
import { Switch as BlueprintSwitch } from "@blueprintjs/core";
import { FormEntryType, FormEntryValueOfType } from "../FormEntry";
import { FormElement, FormElementProps, FormElementValueChangeListener } from "./FormElement";

type SupportedEntryTypes = FormEntryType.Boolean;

export interface SwitchProps extends FormElementProps<SupportedEntryTypes> {
    defaultValue?: boolean;
};

export class Switch extends FormElement<SupportedEntryTypes, SwitchProps> {
    protected readonly supportedFormEntryTypes = [FormEntryType.Boolean] as SupportedEntryTypes[];

    protected renderControlWithoutValue(
        declareValueChange: FormElementValueChangeListener<SupportedEntryTypes>
    ): ReactElement | null {
        const defaultValue = this.props.defaultValue;
        return defaultValue !== undefined
            ? this.renderControl(defaultValue, declareValueChange)
            : null;
    }

    protected renderControl(
        value: FormEntryValueOfType<SupportedEntryTypes>,
        declareValueChange: FormElementValueChangeListener<SupportedEntryTypes>
    ): ReactElement {
        return <BlueprintSwitch
            defaultChecked={value}
            style={this.props.style}
            onChange={() => declareValueChange(!value, this.supportedFormEntryTypes[0])}
            inline={true}
        />;
    };
}