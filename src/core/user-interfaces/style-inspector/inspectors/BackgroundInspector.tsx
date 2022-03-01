import React, { ReactElement } from "react";
import { Color } from "../../../../utilities/Color";
import { ButtonColorPicker } from "../../../../utilities/components/color-pickers/ButtonColorPicker";
import { SpecialisedStyleInspector, SpecialisedStyleInspectorProperties } from "./SpecialisedStyleInspector";

export type BackgroundProperties = SpecialisedStyleInspectorProperties<{
    color?: Color;
}>;

export class BackgroundInspector extends SpecialisedStyleInspector<BackgroundProperties> {
    protected readonly title = "Background";
    protected readonly className = "background";

    private renderColorEditor(): ReactElement | null {
        return this.renderProperty({
            propertyName: "color",
            formGroup: { label: "Color", className: "color" },
            renderer: (propertyValue, isDisabled) =>
                <ButtonColorPicker
                    color={propertyValue}
                    disabled={isDisabled}
                    onDragStart={() => this.props.onTransientChangeStart()}
                    onDragEnd={() => this.props.onTransientChangeEnd()}
                    onChange={newColor => this.props.onPropertyChange({ color: newColor })}
                />
        });
    }

    protected renderEditor(): ReactElement {
        return <>
            {this.renderColorEditor()}
        </>;
    }
}