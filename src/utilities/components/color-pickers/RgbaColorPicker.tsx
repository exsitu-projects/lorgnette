
import React from "react";
import { RgbaColorPicker as ReactColorfulRgbaColorPicker } from "react-colorful";
import { ColorPickerBaseProps, RgbaColor } from "react-colorful/dist/types";
import { Color } from "../../Color";

export type RgbColorPickerProps = {
    color: Color;
    onChange?: (newColor: Color) => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
};

export class RgbaColorPicker extends React.PureComponent<RgbColorPickerProps> {
    private get colorPickerProps(): ColorPickerBaseProps<RgbaColor> {
        return {
            className: "color-picker rgba",
            color: this.props.color as RgbaColor,
            onChange: newColor => this.props.onChange && this.props.onChange(Color.fromRgba(newColor)),
            onMouseDown: () => this.props.onDragStart && this.props.onDragStart(),
            onMouseUp: () => this.props.onDragEnd && this.props.onDragEnd()
        };
    }
    
    render() {
        return <ReactColorfulRgbaColorPicker {...this.colorPickerProps} />;
    }
}