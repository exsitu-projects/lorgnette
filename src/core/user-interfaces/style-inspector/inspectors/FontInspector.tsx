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
                        />
                        <NumericInput
                            value={propertyValue.value}
                            disabled={isDisabled}
                            buttonPosition="none"
                        />
                        <Button
                            text="+"
                            disabled={isDisabled}
                        />
                    </ControlGroup>
                    <InputGroup
                        value={propertyValue.unit}
                        disabled={isDisabled}
                        className="unit"
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
                />
        });

        const italicButton = this.renderProperty({
            propertyName: "italic",
            renderer: (propertyValue, isDisabled) =>
                <Button
                    icon="italic"
                    active={propertyValue}
                    disabled={isDisabled}
                />
        });

        const underlineButton = this.renderProperty({
            propertyName: "underline",
            renderer: (propertyValue, isDisabled) =>
                <Button
                    icon="underline"
                    active={propertyValue}
                    disabled={isDisabled}
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