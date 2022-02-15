import React from "react";
import { BLACK, RgbColor } from "../../../utilities/RgbColor";
import { CodeVisualisation } from "../../visualisations/CodeVisualisation";
import { UserInterface, UserInterfaceOutput } from "../UserInterface";
import { UserInterfaceProvider } from "../UserInterfaceProvider";
import { ColorPickerComponent } from "./ColorPickerComponent";



export interface Input extends RgbColor {};
export interface Output extends UserInterfaceOutput {
    data: RgbColor
};

export class ColorPicker extends UserInterface<Input, Output> {
    readonly className = "color-picker";
    
    private color: RgbColor;
    // private isCurrentlyUsed: boolean;

    constructor(visualisation: CodeVisualisation, color: RgbColor = BLACK) {
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

    createViewContent(): JSX.Element {
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

    static makeProvider(): UserInterfaceProvider {
        return {
            provide: (visualisation: CodeVisualisation): UserInterface<Input, Output> => {
                return new ColorPicker(visualisation);
            }
        };
    }
}