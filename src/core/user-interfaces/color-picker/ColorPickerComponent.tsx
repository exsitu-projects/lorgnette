import React from "react";
import { RgbColorPicker } from "react-colorful";
import { Color } from "../../../utilities/Color";

type Props = {
    color: Color,
    onChange(newColor: Color): void;
    onDragStart(): void;
    onDragEnd(): void;
};

export class ColorPickerComponent extends React.PureComponent<Props> {
    render() {
        return <RgbColorPicker
            color={this.props.color}
            onChange={newColor => this.props.onChange(Color.fromRgb(newColor))}
            onMouseDown={this.props.onDragStart}
            onMouseUp={this.props.onDragEnd}
        />;
    }
}