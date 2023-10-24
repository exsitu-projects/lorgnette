import { Button, ButtonGroup, ControlGroup, FormGroup, InputGroup, NumericInput } from "@blueprintjs/core";
import React, { ReactElement } from "react";
import { Color } from "../../../../utilities/Color";
import { ButtonColorPicker } from "../../../../utilities/components/color-pickers/ButtonColorPicker";
import { ValueWithUnit } from "../../../../utilities/ValueWithUnit";
import { SpecialisedStyleInspector, SpecialisedStyleInspectorProperties } from "./SpecialisedStyleInspector";

export type BorderProperties = SpecialisedStyleInspectorProperties<{
    color?: Color;
    thickness?: ValueWithUnit;
    type?: "solid" | "dashed" | "dotted" | [number, number];
}>;

export class BorderInspector extends SpecialisedStyleInspector<BorderProperties> {
    protected readonly title = "Border";
    protected readonly className = "border";

    // private renderThicknessEditor(): ReactElement | null {
    //     const thickness = this.props.properties.thickness;
    //     if (!thickness) {
    //         return null;
    //     }

    //     return <FormGroup label="Thickness" className="thickness">
    //         {/* <ControlGroup> */}
    //             <NumericInput
    //                 value={thickness.value}
    //                 fill={false}
    //             />
    //             <InputGroup
    //                 value={thickness.unit}
    //                 fill={false}
    //             />
    //         {/* </ControlGroup> */}
    //     </FormGroup>;
    // }

    private renderThicknessEditor(): ReactElement | null {
        const thicknessValues = [1, 2, 3, 4, 5, 10]; // px

        return this.renderProperty({
            propertyName: "thickness",
            formGroup: { label: "Thickness", className: "thickness" },
            renderer: (propertyValue, isDisabled) => {
                const hasZeroThicknessValue = propertyValue.value === 0;
                let selectedThicknessValueIndex: number | null = propertyValue.unit === "px"
                    ? thicknessValues.indexOf(propertyValue.value) ?? null
                    : null;

                return <ButtonGroup>
                    <Button
                        active={hasZeroThicknessValue}
                        disabled={isDisabled}
                        icon="disable"
                        onClick={() => this.changeProperties({ thickness: new ValueWithUnit(0, "px") })}
                    />
                    {thicknessValues.map((thicknessValue, index) =>
                        <Button
                            active={index === selectedThicknessValueIndex}
                            disabled={isDisabled}
                            icon={thicknessValue === 0 ? "disable" : null}
                            onClick={() => this.changeProperties({ thickness: new ValueWithUnit(thicknessValue, "px") })}
                        >{
                            <div className="thickness-preview" style={{ borderWidth: thicknessValue }} />
                        }</Button>
                    )}
                </ButtonGroup>
            }
        });
    }

    private renderTypeEditor(): ReactElement | null {
        return this.renderProperty({
            propertyName: "type",
            formGroup: { label: "Type", className: "type" },
            renderer: (propertyValue, isDisabled) =>
                <ButtonGroup>
                    <Button
                        text="–"
                        active={propertyValue === "solid"}
                        disabled={isDisabled}
                        onClick={() => this.changeProperties({ type: "solid" })}
                    />
                    <Button
                        text="- -"
                        active={propertyValue === "dashed"}
                        disabled={isDisabled}
                        onClick={() => this.changeProperties({ type: "dashed" })}
                    />
                    <Button
                        text="···"
                        active={propertyValue === "dotted"}
                        disabled={isDisabled}
                        onClick={() => this.changeProperties({ type: "dotted" })}
                    />
                </ButtonGroup>
        });
    }

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
            {this.renderThicknessEditor()}
            {this.renderTypeEditor()}
            {this.renderColorEditor()}
        </>;
    }
}