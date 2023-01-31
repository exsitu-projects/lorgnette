import React, { ReactElement } from "react";
import { ItemRenderer, Select2 } from "@blueprintjs/select";
import { FormEntryType, FormEntryValueOfType } from "../FormEntry";
import { FormElement, FormElementProps, FormElementValueChangeListener } from "./FormElement";
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
    defaultItem?: string;
    enableSearch?: boolean;
};

export class Select extends FormElement<SupportedEntryTypes, SelectProps> {
    protected readonly supportedFormEntryTypes = [FormEntryType.String] as SupportedEntryTypes[];

    protected renderControlWithoutValue(
        declareValueChange: FormElementValueChangeListener<SupportedEntryTypes>
    ): ReactElement | null {
        const defaultItem = this.props.defaultItem;
        return defaultItem !== undefined
            ? this.renderControl(defaultItem, declareValueChange)
            : null;
    }
    
    protected renderControl(
        value: FormEntryValueOfType<SupportedEntryTypes>,
        declareValueChange: FormElementValueChangeListener<SupportedEntryTypes>
    ): ReactElement {
        const currentValue = value;
        return <Select2<string>
            items={this.props.items}
            itemRenderer={SelectItemRenderer}
            onItemSelect={item => declareValueChange(item, this.supportedFormEntryTypes[0])}
            activeItem={currentValue}
            popoverProps={{
                minimal: true,
                usePortal: false,
                portalContainer: document.body
            }}
            filterable={this.props.enableSearch ?? false}
        >
            <Button
                text={currentValue}
                rightIcon="caret-down"
                style={this.props.style}
            />
        </Select2>;
    };
}