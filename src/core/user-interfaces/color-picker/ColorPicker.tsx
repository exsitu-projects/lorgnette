import React from "react";
import { BLACK, Color } from "../../../utilities/Color";
import { RgbColorPicker } from "../../../utilities/components/color-pickers/RgbColorPicker";
import { Monocle } from "../../visualisations/Monocle";
import { UserInterface, UserInterfaceOutput } from "../UserInterface";
import { UserInterfaceProvider } from "../UserInterfaceProvider";



export interface Input extends Color {};
export interface Output extends UserInterfaceOutput {
    color: Color
};

export class ColorPicker extends UserInterface<Input, Output> {
    readonly className = "color-picker";
    
    private color: Color;
    // private isCurrentlyUsed: boolean;

    constructor(monocle: Monocle, color: Color = BLACK) {
        super(monocle);

        this.color = color;
        // this.isCurrentlyUsed = false;
    }

    protected get minDelayBetweenModelChangeNotifications(): number {
        return 100; // ms
    }

    setColor(newColor: Color): void {
        this.color = newColor;
    }

    createViewContent(): JSX.Element {
        const onChange = (newColor: Color) => {
            this.color = newColor;
            this.declareModelChange();
        };

        return <RgbColorPicker
            color={this.color}
            onChange={onChange}
            onDragStart={() => {
                // this.isCurrentlyUsed = true;
                this.beginTransientState();
            }}
            onDragEnd={() => {
                // this.isCurrentlyUsed = false;
                this.endTransientState();
                this.declareModelChange(true);
            }}
        />;
    }

    protected get modelOutput(): Output {
        return {
            color: this.color
        };
    }

    updateModel(input: Input): void {
        // TODO: check input
        this.setColor(input);
    }

    static makeProvider(): UserInterfaceProvider {
        return {
            provideForMonocle: (monocle: Monocle): UserInterface<Input, Output> => {
                return new ColorPicker(monocle);
            }
        };
    }
}