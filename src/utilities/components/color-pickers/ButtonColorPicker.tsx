import "./color-picker.css";

import React, { ReactElement } from "react";
import { Button } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { Color } from "../../Color";
import { RgbaColorPicker } from "./RgbaColorPicker";
import { RgbColorPicker } from "./RgbColorPicker";

type Props = {
    color: Color;
    useRgba?: boolean;
    disabled?: boolean;
    onChange?: (newColor: Color) => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
};

export class ButtonColorPicker extends React.PureComponent<Props> {
    private get shouldUseRgba(): boolean {
        return !!this.props.useRgba;
    }
    
    render() {
        const colorPicker = this.shouldUseRgba
            ? <RgbaColorPicker {...this.props} />
            : <RgbColorPicker {...this.props} />;
        
        return <Popover2
            placement="bottom"
            modifiers={{
                arrow: { enabled: false },
                offset: { enabled: true }
            }}
            usePortal={true}
            portalContainer={document.body}
            portalClassName="floating-color-picker-wrapper"
            content={colorPicker}
            renderTarget={({ isOpen, ref,  ...targetProps }) =>
                <Button
                    {...targetProps}
                    elementRef={ref as any}
                    className="color-picker-button"
                    disabled={this.props.disabled}
                >
                    <div
                        className="color-preview"
                        style={{ backgroundColor: this.props.color.css }}
                    />
                </Button>
            }
        />;
    }
}