import React, { ReactElement } from "react";
import { ValueWithUnit } from "../../../../utilities/ValueWithUnit";
import { SpecialisedStyleInspector, SpecialisedStyleInspectorProperties } from "./SpecialisedStyleInspector";

export type Margin = {
    top: ValueWithUnit;
    bottom: ValueWithUnit;
    left: ValueWithUnit;
    right: ValueWithUnit;
};

export type MarginProperties = SpecialisedStyleInspectorProperties<{
    inner?: Margin;
    outer?: Margin;
}>;

export class MarginInspector extends SpecialisedStyleInspector<MarginProperties> {
    protected readonly title = "Margins";
    protected readonly className = "margin";

    protected renderEditor(): ReactElement {
        return <>
        
        </>;
    }
}