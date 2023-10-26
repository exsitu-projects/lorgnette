import { ReactElement } from "react";
import { FormEntryType, FormEntryValueOfType } from "../FormEntry";
import { FormElement, FormElementProps, FormElementValueChangeListener } from "./FormElement";
import { ButtonColorPicker as ButtonColorPickerComponent } from "../../../../utilities/components/color-pickers/ButtonColorPicker";
import { Color } from "../../../../utilities/Color";

type SupportedEntryTypes = FormEntryType.Color;

export interface ButtonProps extends FormElementProps<SupportedEntryTypes> {
    defaultValue?: Color;
}

export class ButtonColorPicker extends FormElement<SupportedEntryTypes, ButtonProps> {
    protected readonly supportedFormEntryTypes = [FormEntryType.Color] as SupportedEntryTypes[];

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
        return <ButtonColorPickerComponent
            color={value}
            buttonStyle={this.props.style}
            onOpen={() => beginTransientState()}
            onClose={() => endTransientState()}
            onChange={newColor => declareValueChange(newColor, this.supportedFormEntryTypes[0])}
        />;
    }
}
