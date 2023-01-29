import { ReactElement } from "react";
import { ButtonProps as BlueprintsButtonProps } from "@blueprintjs/core";
import { FormEntryOfType, FormEntryType, FormEntryValueOfType } from "../FormEntry";
import { FormElement, FormElementProps } from "./FormElement";
import { ButtonColorPicker as ButtonColorPickerComponent } from "../../../../utilities/components/color-pickers/ButtonColorPicker";

type SupportedEntryTypes = FormEntryType.Color;

export interface ButtonProps extends FormElementProps<SupportedEntryTypes> {
    
};

export class ButtonColorPicker extends FormElement<SupportedEntryTypes, ButtonProps> {
    protected readonly supportedFormEntryTypes = [FormEntryType.Color] as SupportedEntryTypes[];

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
        return <ButtonColorPickerComponent
            color={formEntry.value}
            buttonStyle={this.props.style}
            onOpen={() => beginTransientState()}
            onClose={() => endTransientState()}
            onChange={newColor => declareValueChange(newColor)}
        />
    };
}
