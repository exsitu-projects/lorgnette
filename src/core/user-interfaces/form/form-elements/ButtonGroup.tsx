import React, { ReactElement } from "react";
import { ButtonGroup as BlueprintsButtonGroup, ButtonGroupProps as BlueprintsButtonGroupProps } from "@blueprintjs/core";
import { AnyEntryTypeSymbol, ANY_ENTRY_TYPES } from "./FormElement";
import { evaluate, Valuable } from "../../../../utilities/Valuable";

export interface ButtonGroupProps {
    fill: Valuable<boolean>;
    vertical: Valuable<boolean>;
}

export class ButtonGroup extends React.PureComponent<BlueprintsButtonGroupProps> {
    protected readonly supportedFormEntryTypes: AnyEntryTypeSymbol = ANY_ENTRY_TYPES;

    render(): ReactElement {
        const fill = evaluate(this.props.fill ?? false);
        const vertical = evaluate(this.props.vertical ?? false);

        return <BlueprintsButtonGroup
            fill={fill}
            vertical={vertical}
        >
            {this.props.children}
        </BlueprintsButtonGroup>
    };
}
