import React from "react";
import { RgbColor } from "../../../utilities/RgbColor";
import { CodeVisualisation } from "../../visualisations/CodeVisualisation";
import { UserInterface, UserInterfaceInput, UserInterfaceOutput } from "../UserInterface";
import { UserInterfaceProvider } from "../UserInterfaceProvider";
import { PlotStyleEditorChangeHandler, PlotStyleEditorComponent } from "./PlotStyleEditorComponent";
import { DEFAULT_PLOT_STYLE_EDITOR_SETTINGS, derivePlotStyleEditorSettingsFromDefaults, PartialPlotStyleEditorSettings, PlotStyleEditorSettings } from "./PlotStyleEditorSettings";

export type PlotStyle = {
    type?: string;
    color?: RgbColor;
    filled?: boolean;
    opacity?: number;
    thickness?: number;
    shape?: string;
    horizontal?: boolean;
};

export interface Input extends UserInterfaceInput {
    style: PlotStyle;
    settings?: PartialPlotStyleEditorSettings;
};

export interface Output extends UserInterfaceOutput {
    data: {
        style: PlotStyle;
        styleChange: PlotStyle;
    }
};

export class PlotStyleEditor extends UserInterface<Input, Output> {
    readonly className = "plot-style-editor";

    private style: PlotStyle;
    private lastStyleChange: PlotStyle;
    // private isLastStyleChangeTransient: boolean;

    private settings: PlotStyleEditorSettings;

    constructor(visualisation: CodeVisualisation) {
        super(visualisation);

        this.style = {};
        this.lastStyleChange = {};
        // this.isLastStyleChangeTransient = false;

        this.settings = DEFAULT_PLOT_STYLE_EDITOR_SETTINGS;
    }

    protected get minDelayBetweenModelChangeNotifications(): number {
        return 100; // ms
    }

    setStateFromInput(input: Input): void {
        this.style = input.style;
        this.settings = derivePlotStyleEditorSettingsFromDefaults(input.settings ?? {});
    }

    createViewContent(): JSX.Element {
        const onChange: PlotStyleEditorChangeHandler = (
            styleChange: PlotStyle,
            newStyle: PlotStyle,
            // isTransient: boolean
        ) => {
            this.style = newStyle;
            this.lastStyleChange = styleChange;

            // this.isLastStyleChangeTransient = isTransient;
            this.declareModelChange();
        };

        const onTransientChangeStart = () => {
            this.startTransientEdit();
            console.log("start transient")
        }
        const onTransientChangeEnd = () => {
            this.stopTransientEdit();
            this.declareModelChange(true);
            console.log("stop transient")
        }

        return <PlotStyleEditorComponent 
            style={this.style}
            settings={this.settings}
            onChange={onChange}
            onTransientChangeStart={onTransientChangeStart}
            onTransientChangeEnd={onTransientChangeEnd}
        />;
    }

    protected get modelOutput(): Output {
        return {
            ...this.getPartialModelOutput(),
            data: {
                style: this.style,
                styleChange: this.lastStyleChange
            }
        };
    }

    updateModel(input: Input): void {
        // TODO: check input
        this.setStateFromInput(input);
    }

    static makeProvider(): UserInterfaceProvider {
        return {
            provide: (visualisation: CodeVisualisation): UserInterface<Input, Output> => {
                return new PlotStyleEditor(visualisation);
            }
        };
    }
}