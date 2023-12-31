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
                    onDragStart={() => this.startTransientChange()}
                    onDragEnd={() => this.endTransientChange()}
                    onChange={newColor => this.changeProperties({ color: newColor })}
                />
        });
    }

    protected renderEditor(): ReactElement {
        return <>
            {this.renderColorEditor()}
        </>;
    }
}