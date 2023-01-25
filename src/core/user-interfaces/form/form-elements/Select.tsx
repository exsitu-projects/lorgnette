import React, { ReactElement } from "react";
import { ItemRenderer, Select2, Select2Props } from "@blueprintjs/select";
import { FormEntryOfType, FormEntryType, FormEntryValueOfType } from "../FormEntry";
import { FormElement, FormElementProps } from "./FormElement";
import { Button, MenuItem } from "@blueprintjs/core";

type SupportedEntryTypes = FormEntryType.String;

const SelectItemRenderer: ItemRenderer<string> =
    (item, { handleClick, handleFocus, modifiers, query }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        
        return (
            <MenuItem
                text={item}
                key={item}
                active={modifiers.active}
                disabled={modifiers.disabled}
                onClick={handleClick}
                onFocus={handleFocus}
            />
        );
    };

export interface SelectProps extends FormElementProps<SupportedEntryTypes> {
    items: string[];
    enableSearch?: boolean;
};

export class Select extends FormElement<SupportedEntryTypes, SelectProps> {
    protected readonly supportedFormEntryTypes = [FormEntryType.String] as SupportedEntryTypes[];

    private get inputConfigurationProps(): Partial<Select2Props<string>> {
        return {
            filterable: this.props.enableSearch ?? false
        };
    }

    renderControl(
        formEntry: FormEntryOfType<SupportedEntryTypes>,
        declareValueChange: (newValue: FormEntryValueOfType<SupportedEntryTypes>) => void
    ): ReactElement {
        const currentValue = formEntry.value;
        return <Select2<string>
            items={this.props.items}
            itemRenderer={SelectItemRenderer}
            onItemSelect={item => declareValueChange(item)}
            activeItem={currentValue}
            popoverProps={{
                minimal: true,
                usePortal: false,
                portalContainer: document.body
            }}
            {...this.inputConfigurationProps}
        >
            <Button
                text={currentValue}
                rightIcon="caret-down"
                style={this.props.style}
            />
        </Select2>;
    };
}