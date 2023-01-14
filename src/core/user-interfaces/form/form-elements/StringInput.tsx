import React, { ReactElement } from "react";
import { InputGroup, InputGroupProps } from "@blueprintjs/core";
import { FormEntryOfType, FormEntryType, FormEntryValueOfType } from "../FormEntry";
import { FormElement, FormElementProps } from "./FormElement";

type SupportedEntryTypes = FormEntryType.String;

export interface StringInputProps extends FormElementProps<SupportedEntryTypes> {};

export class StringInput extends FormElement<SupportedEntryTypes, StringInputProps> {
    protected readonly supportedFormEntryTypes = [FormEntryType.String] as SupportedEntryTypes[];

    private get inputConfigurationProps(): Partial<InputGroupProps> {
        return {
            
        };
    }

    renderControl(
        formEntry: FormEntryOfType<SupportedEntryTypes>,
        declareValueChange: (newValue: FormEntryValueOfType<SupportedEntryTypes>) => void
    ): ReactElement {
        return <InputGroup
            defaultValue={formEntry.value}
            onChange={event => declareValueChange(event.target.value)}
            {...this.inputConfigurationProps}
        />;
    };
}