import React, { PropsWithChildren, ReactElement } from "react";
import { ButtonGroup as BlueprintButtonGroup } from "@blueprintjs/core";
import { AnyEntryTypeSymbol, ANY_ENTRY_TYPES } from "../FormElement";
import { Label } from "./Label";

export type ButtonGroupProps = PropsWithChildren<{
    label?: string;
    fill?: boolean;
    vertical?: boolean;
}>;

export class ButtonGroup extends React.PureComponent<ButtonGroupProps> {
    protected readonly supportedFormEntryTypes: AnyEntryTypeSymbol = ANY_ENTRY_TYPES;

    protected renderGroup(): ReactElement {
        const fill = this.props.fill ?? false;
        const vertical = this.props.vertical ?? false;

        return <BlueprintButtonGroup
            className="form-button-group"
            fill={fill}
            vertical={vertical}
        >
            { this.props.children }
        </BlueprintButtonGroup>;
    }

    render(): ReactElement | null {
        const label = this.props.label;
        return label
            ? Label.wrapNonEmptyComponentWithLabel(this.renderGroup(), label)
            : this.renderGroup();
    };
}
