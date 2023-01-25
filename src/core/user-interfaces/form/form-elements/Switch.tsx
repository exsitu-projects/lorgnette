import React, { ReactElement } from "react";
import { Switch as BlueprintSwitch } from "@blueprintjs/core";
import { FormEntryOfType, FormEntryType, FormEntryValueOfType } from "../FormEntry";
import { FormElement, FormElementProps } from "./FormElement";

type SupportedEntryTypes = FormEntryType.Boolean;

export interface SwitchProps extends FormElementProps<SupportedEntryTypes> {};

export class Switch extends FormElement<SupportedEntryTypes, SwitchProps> {
    protected readonly supportedFormEntryTypes = [FormEntryType.Boolean] as SupportedEntryTypes[];

    renderControl(
        formEntry: FormEntryOfType<SupportedEntryTypes>,
        declareValueChange: (newValue: FormEntryValueOfType<SupportedEntryTypes>) => void
    ): ReactElement {
        return <BlueprintSwitch
            defaultChecked={formEntry.value}
            style={this.props.style}
            onChange={() => declareValueChange(!formEntry.value)}
            inline={true}
        />;
    };
}