import React from "react";
import { RgbColorPicker as ReactColorfulRgbColorPicker } from "react-colorful";
import { ColorPickerBaseProps, RgbColor } from "react-colorful/dist/types";
import { Color } from "../../Color";

export type RgbColorPickerProps = {
    color: Color;
    onChange?: (newColor: Color) => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
};

export class RgbColorPicker extends React.PureComponent<RgbColorPickerProps> {
    private get colorPickerProps(): ColorPickerBaseProps<RgbColor> {
        return {
            color: this.props.color as RgbColor,
            onChange: newColor => this.props.onChange && this.props.onChange(Color.fromRgb(newColor)),
            onMouseDown: () => this.props.onDragStart && this.props.onDragStart(),
            onMouseUp: () => this.props.onDragEnd && this.props.onDragEnd()
        };
    }
    
    render() {
        return <ReactColorfulRgbColorPicker {...this.colorPickerProps} />;
    }
}