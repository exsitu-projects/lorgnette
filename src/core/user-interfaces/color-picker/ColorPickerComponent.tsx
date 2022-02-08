import React from "react";
import { RgbColorPicker } from "react-colorful";
import { RgbColor } from "../../../utilities/RgbColor";

type Props = {
    color: RgbColor,
    onChange(newColor: RgbColor): void;
    onDragStart(): void;
    onDragEnd(): void;
};

export class ColorPickerComponent extends React.PureComponent<Props> {
    render() {
        return <div className="ui color-picker">
            <RgbColorPicker
                color={this.props.color}
                onChange={this.props.onChange}
                onMouseDown={this.props.onDragStart}
                onMouseUp={this.props.onDragEnd}
            />
        </div>;
    }
}