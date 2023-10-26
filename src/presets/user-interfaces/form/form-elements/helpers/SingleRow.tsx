import React, { PropsWithChildren, ReactElement } from "react";
import { AnyEntryTypeSymbol, ANY_ENTRY_TYPES } from "../FormElement";
import { Label } from "./Label";

export type SingleRowProps = PropsWithChildren<{
    label?: string;
    style?: React.CSSProperties;
    gapSize?: number | string;
}>;

export class SingleRow extends React.PureComponent<SingleRowProps> {
    protected readonly supportedFormEntryTypes: AnyEntryTypeSymbol = ANY_ENTRY_TYPES;

    protected renderSingleRow(): ReactElement {
        return <div
            className="form-single-row"
            style={{
                gap: this.props.gapSize,
                ...this.props.style
            }}
        >
            { this.props.children }
        </div>;
    }

    render(): ReactElement | null {
        const label = this.props.label;
        return label ?
            Label.wrapNonEmptyComponentWithLabel(this.renderSingleRow(), label)
            : this.renderSingleRow();
    }
}
