import "./color-picker.css";

import React from "react";
import { Button, Popover } from "@blueprintjs/core";
import { Color } from "../../Color";
import { RgbaColorPicker } from "./RgbaColorPicker";
import { RgbColorPicker } from "./RgbColorPicker";

type Props = {
    color: Color;
    useRgba?: boolean;
    disabled?: boolean;
    buttonStyle?: React.CSSProperties;
    onChange?: (newColor: Color) => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    onOpen?: () => void;
    onClose?: () => void;
};

type State = {
    color: Color;
};

export class ButtonColorPicker extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { color: this.props.color };
    }

    private get shouldUseRgba(): boolean {
        return !!this.props.useRgba;
    }

    private handleColorChange(newColor: Color): void {
        if (this.props.onChange) {
            this.props.onChange(newColor);
        }

        this.setState({ color: newColor });
    }
    
    render() {
        const ColorPickerComponent = this.shouldUseRgba
            ? RgbaColorPicker
            : RgbColorPicker;
        const colorPicker = <ColorPickerComponent
            {...this.props }
            onChange={newColor => this.handleColorChange(newColor)}
        />;

        return <Popover
            placement="bottom"
            modifiers={{
                arrow: { enabled: false },
                offset: { enabled: true }
            }}
            usePortal={true}
            portalContainer={document.body}
            portalClassName="floating-color-picker-wrapper"
            onOpened={node => this.props.onOpen && this.props.onOpen()}
            onClosed={node => this.props.onClose && this.props.onClose()}
            content={colorPicker}
            renderTarget={({ isOpen, ref,  ...targetProps }) =>
                <Button
                    {...targetProps }
                    ref={ref}
                    className="color-picker-button"
                    disabled={this.props.disabled}
                    style={this.props.buttonStyle}
                >
                    <div
                        className="color-preview"
                        style={{ backgroundColor: this.state.color.css }}
                    />
                </Button>
            }
        />;
    }
}