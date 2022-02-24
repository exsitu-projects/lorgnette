import React, { ReactElement } from "react";
import "./plot-style-editor.css";
import { Switch, Label, Slider, Button, MenuItem } from "@blueprintjs/core";
import { ItemRenderer, Suggest } from "@blueprintjs/select";
import { clamp, round } from "../../../utilities/math";
import { PlotStyle } from "./PlotStyleEditor";
import { PlotStyleEditorSettings } from "./PlotStyleEditorSettings";
import { Color } from "../../../utilities/Color";
import { ButtonColorPicker } from "../../../utilities/components/color-pickers/ButtonColorPicker";

export type PlotStyleEditorChangeHandler = (
    styleChange: PlotStyle,
    newStyle: PlotStyle,
    isTransient: boolean
) => void;

type Props = {
    style: PlotStyle;
    settings: PlotStyleEditorSettings;
    onChange: PlotStyleEditorChangeHandler;
    onTransientChangeStart: () => void;
    onTransientChangeEnd: () => void;
};

export class PlotStyleEditorComponent extends React.PureComponent<Props> {
    private isInTransientState: boolean;

    constructor(props: Props) {
        super(props);
        this.isInTransientState = false;
    }

    private processChange(styleChange: PlotStyle, updateTransientStateTo: boolean = false): void {
        if (updateTransientStateTo !== undefined) {
            if (!this.isInTransientState && updateTransientStateTo === true) {
                this.isInTransientState = true;
                this.props.onTransientChangeStart();
            }
            else if (this.isInTransientState && updateTransientStateTo === false) {
                this.isInTransientState = false;
                this.props.onTransientChangeEnd();
            }
        }

        const newStyle = {
            ...this.props.style,
            ...styleChange
        };

        this.props.onChange(styleChange, newStyle, this.isInTransientState);
    }

    private renderPropertyIfDefinedOrNothing<T>(
        property: T | undefined,
        renderer: ((property: T) => ReactElement))
    : ReactElement | null {
        if (property === undefined) {
            return null;
        }

        return renderer(property);
    }

    private renderTypePropertyEditor(): ReactElement | null {
        const renderTypeItem: ItemRenderer<string> = (
            type,
            { handleClick, modifiers }
          ) => {
            if (!modifiers.matchesPredicate) {
                return null;
            }
      
            return (
                <MenuItem
                    active={modifiers.active}
                    key={type}
                    onClick={handleClick}
                    text={type}
                />
            );
        };

        return this.renderPropertyIfDefinedOrNothing(
            this.props.style.type,
            type => 
                <Label className="property-editor">
                    <span className="label">Type</span>
                    <div className="editor">
                        <Suggest
                            items={this.props.settings.type.types}
                            itemRenderer={renderTypeItem}
                            inputValueRenderer={item => item}
                            defaultSelectedItem={type}
                            onItemSelect={newType => this.processChange({ type: newType })}
                        />
                    </div>
                    <div className="preview">

                    </div>
                </Label>
        );
    }

    private renderColorPropertyEditor(): ReactElement | null {
        return this.renderPropertyIfDefinedOrNothing(
            this.props.style.color,
            color => 
                <Label className="property-editor">
                    <span className="label">Color</span>
                        <div className="editor">
                            <ButtonColorPicker
                                color={color}
                                onDragStart={() => this.props.onTransientChangeStart()}
                                onDragEnd={() => this.props.onTransientChangeEnd()}
                                onChange={newColor => this.processChange({ color: Color.fromRgba(newColor) })}
                            />
                        </div>
                </Label>
        );
    }

    private renderFilledPropertyEditor(): ReactElement | null {
        return this.renderPropertyIfDefinedOrNothing(
            this.props.style.filled,
            filled => 
                <Label className="property-editor">
                    <span className="label">Filled</span>
                        <div className="editor">
                            <Switch
                                large={true}
                                checked={filled}
                                onChange={event => this.processChange({ filled: !filled })}
                            />
                        </div>
                        <div className="preview">

                        </div>
                </Label>
        );
    }

    private renderOpacityPropertyEditor(): ReactElement | null {
        return this.renderPropertyIfDefinedOrNothing(
            this.props.style.opacity,
            opacity => 
                <Label className="property-editor">
                    <span className="label">Opacity</span>
                    <div className="editor">
                        <Slider
                            value={clamp(this.props.settings.opacity.min, opacity, this.props.settings.opacity.max)}
                            min={this.props.settings.opacity.min}
                            max={this.props.settings.opacity.max}
                            stepSize={this.props.settings.opacity.step}
                            onChange={newOpacity => this.processChange({ opacity: round(newOpacity, 2) }, true)}
                            onRelease={newOpacity => this.processChange({ opacity: round(newOpacity, 2) }, false)}
                        />
                    </div>
                    <div className="preview">

                    </div>
                </Label>
        );
    }

    private renderThicknessPropertyEditor(): ReactElement | null {
        return this.renderPropertyIfDefinedOrNothing(
            this.props.style.thickness,
            thickness => 
                <Label className="property-editor">
                    <span className="label">Thickness</span>
                    <div className="editor">
                        <Slider
                            value={clamp(this.props.settings.thickness.min, thickness, this.props.settings.thickness.max)}
                            min={this.props.settings.thickness.min}
                            max={this.props.settings.thickness.max}
                            stepSize={this.props.settings.thickness.step}
                            onChange={newThickness => this.processChange({ thickness: newThickness }, true)}
                            onRelease={newThickness => this.processChange({ thickness: newThickness }, false)}
                        />
                    </div>
                    <div className="preview">

                    </div>
                </Label>
        );
    }

    private renderShapePropertyEditor(): ReactElement | null {
        return this.renderPropertyIfDefinedOrNothing(
            this.props.style.shape,
            shape => 
                <Label className="property-editor">
                    <span className="label">shape</span>
                    <div className="editor">
                        <Suggest
                            items={this.props.settings.shape.shapes}
                            inputValueRenderer={item => item}
                            selectedItem={shape}
                            onItemSelect={newShape => this.processChange({ type: newShape })}
                        />
                    </div>
                    <div className="preview">

                    </div>
                </Label>
        );
    }

    private renderHorizontalPropertyEditor(): ReactElement | null {
        return this.renderPropertyIfDefinedOrNothing(
            this.props.style.horizontal,
            horizontal => 
                <Label className="property-editor">
                    <span className="label">Horizontal</span>
                    <div className="editor">
                        <Switch
                            large={true}
                            checked={horizontal}
                            onChange={() => this.processChange({ horizontal: !this.props.style.horizontal })}
                        />
                    </div>
                    <div className="preview">

                    </div>
                </Label>
        );
    }

    render() {
        return <>
            {this.renderTypePropertyEditor()}
            {this.renderColorPropertyEditor()}
            {this.renderOpacityPropertyEditor()}
            {this.renderFilledPropertyEditor()}
            {this.renderThicknessPropertyEditor()}
            {this.renderShapePropertyEditor()}
            {this.renderHorizontalPropertyEditor()}
        </>;
    }
}