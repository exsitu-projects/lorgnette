import React, { ReactElement } from "react";
import { Button, ButtonGroup, ControlGroup, FormGroup, InputGroup, Label, NumericInput, TagInput } from "@blueprintjs/core";
import { Color } from "../../../../utilities/Color";
import { ButtonColorPicker } from "../../../../utilities/components/color-pickers/ButtonColorPicker";
import { SpecialisedStyleInspector, SpecialisedStyleInspectorProperties } from "./SpecialisedStyleInspector";
import { ValueWithUnit } from "../../../../utilities/ValueWithUnit";

export type FontProperties = SpecialisedStyleInspectorProperties<{
    color?: Color;
    size?: ValueWithUnit;
    family?: string[];
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
}>;

export class FontInspector extends SpecialisedStyleInspector<FontProperties> {
    protected readonly title = "Font";
    protected readonly className = "font";

    private renderSizeEditor(): ReactElement | null {
        return this.renderProperty({
            propertyName: "size",
            formGroup: { label: "Size", className: "size" },
            renderer: (propertyValue, isDisabled) =>
                <>
                    <ControlGroup className="value">
                        <Button
                            text="–"
                            disabled={isDisabled}
                            onClick={() => this.changeProperties({
                                size: propertyValue.with({ value: propertyValue.value - 1 })
                            })}
                        />
                        <NumericInput
                            value={propertyValue.value}
                            min={0}
                            disabled={isDisabled}
                            buttonPosition="none"
                            onChange={htmlElement => this.changeProperties({
                                size: propertyValue.with({ value: Number(htmlElement.target.value) })
                            })}
                        />
                        <Button
                            text="+"
                            disabled={isDisabled}
                            onClick={() => this.changeProperties({
                                size: propertyValue.with({ value: Math.max(0, propertyValue.value + 1) })
                            })}
                        />
                    </ControlGroup>
                    <InputGroup
                        value={propertyValue.unit}
                        disabled={isDisabled}
                        className="unit"
                        onChange={htmlElement => this.changeProperties({
                            size: propertyValue.with({ unit: htmlElement.target.value })
                        })}
                    />
                </>
        });
    }

    private renderStyleEditor(): ReactElement | null {
        const boldButton = this.renderProperty({
            propertyName: "bold",
            renderer: (propertyValue, isDisabled) =>
                <Button
                    icon="bold"
                    active={propertyValue}
                    disabled={isDisabled}
                    onClick={() => this.changeProperties({ bold: !propertyValue })}
                />
        });

        const italicButton = this.renderProperty({
            propertyName: "italic",
            renderer: (propertyValue, isDisabled) =>
                <Button
                    icon="italic"
                    active={propertyValue}
                    disabled={isDisabled}
                    onClick={() => this.changeProperties({ italic: !propertyValue })}
                />
        });

        const underlineButton = this.renderProperty({
            propertyName: "underline",
            renderer: (propertyValue, isDisabled) =>
                <Button
                    icon="underline"
                    active={propertyValue}
                    disabled={isDisabled}
                    onClick={() => this.changeProperties({ underline: !propertyValue })}
                />
        });

        const hasAtLeastOneButton = boldButton || italicButton || underlineButton;
        if (!hasAtLeastOneButton) {
            return null;
        }

        return <FormGroup
            label="Style"
            className="style"
        >
            <ButtonGroup>
                {boldButton}
                {italicButton}
                {underlineButton}
            </ButtonGroup>
        </FormGroup>;
    }

    private renderFamilyEditor(): ReactElement | null {
        return this.renderProperty({
            propertyName: "family",
            formGroup: { label: "Family", className: "family" },
            renderer: (propertyValue, isDisabled) =>
                <TagInput
                    values={propertyValue}
                    disabled={isDisabled}
                    onChange={tagNodes => this.changeProperties({ family: tagNodes.map(node => node!.toString()) })}
                />
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
            {this.renderSizeEditor()}
            {this.renderStyleEditor()}
            {this.renderColorEditor()}
            {this.renderFamilyEditor()}
        </>;
    }
}