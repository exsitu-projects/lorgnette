import React from "react";
import { CodeVisualisation } from "../../visualisations/CodeVisualisation";
import { UserInterface, UserInterfaceOutput } from "../UserInterface";
import { ColorPickerComponent } from "./ColorPickerComponent";

type RgbColor = {r: number, g: number, b: number};
const BLACK_COLOR = {r: 0, g: 0, b: 0};

export interface Input extends RgbColor {};
export interface Output extends UserInterfaceOutput {
    data: RgbColor
};

export class ColorPicker extends UserInterface<Input, Output> {
    private color: RgbColor;
    // private isCurrentlyUsed: boolean;

    constructor(visualisation: CodeVisualisation, color: RgbColor = BLACK_COLOR) {
        super(visualisation);

        this.color = color;
        // this.isCurrentlyUsed = false;
    }

    protected get minDelayBetweenModelChangeNotifications(): number {
        return 100; // ms
    }

    setColor(newColor: RgbColor): void {
        this.color = newColor;
    }

    createView(): JSX.Element {
        const onChange = (newColor: RgbColor) => {
            this.color = newColor;
            this.declareModelChange();
        };

        return <ColorPickerComponent 
            color={this.color}
            onChange={onChange}
            onDragStart={() => {
                // this.isCurrentlyUsed = true;
                this.startTransientEdit();
            }}
            onDragEnd={() => {
                // this.isCurrentlyUsed = false;
                this.stopTransientEdit();
                this.declareModelChange(true);
            }}
        />;
    }

    protected get modelOutput(): Output {
        return {
            ...this.getPartialModelOutput(),
            data: this.color
        };
    }

    updateModel(input: Input): void {
        // TODO: check input
        this.setColor(input);
    }
}