import React, { PropsWithChildren, ReactElement } from "react";
import { Label as BlueprintLabel } from "@blueprintjs/core";

export type LabelProps = PropsWithChildren<{
    title: string;
}>;

export class Label extends React.PureComponent<LabelProps> {
    render(): ReactElement {
        return <BlueprintLabel>
            <span className="form-label-text">{ this.props.title }</span>
            { this.props.children }
        </BlueprintLabel>;
    }

    static wrapNonEmptyComponentWithLabel(
        component: ReactElement | null,
        label: string
    ): ReactElement | null {
        return component
            ? <Label title={label}>{ component }</Label>
            : component;
    }
}
