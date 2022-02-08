import { DeepOptionalProperties } from "../../../utilities/types";

export type PlotStyleEditorSettings = {
    type: {
        types: string[];
    };

    opacity: {
        min: number;
        max: number;
        step: number;
    };

    thickness: {
        min: number;
        max: number;
        step: number;
    }; 

    shape: {
        shapes: string[];
    };
};

export type PartialPlotStyleEditorSettings = DeepOptionalProperties<PlotStyleEditorSettings>;

export const DEFAULT_PLOT_STYLE_EDITOR_SETTINGS: PlotStyleEditorSettings = {
    type: {
        types: ["bar", "line", "area", "point"]
    },

    opacity: {
        min: 0,
        max: 1,
        step: 0.01
    },

    thickness: {
        min: 0,
        max: 16,
        step: 1
    },

    shape: {
        shapes: [".", "o", "x"]
    }
};

export function derivePlotStyleEditorSettingsFromDefaults(settings: PartialPlotStyleEditorSettings): PlotStyleEditorSettings {
    function getValueInSettingsOrUseDefault<T>(getter: (settings: PartialPlotStyleEditorSettings) => T | undefined): T {
        return getter(settings) ?? getter(DEFAULT_PLOT_STYLE_EDITOR_SETTINGS)!;
    }

    return {
        type: {
            types: getValueInSettingsOrUseDefault(s => s.type?.types)
        },

        opacity: {
            min: getValueInSettingsOrUseDefault(s => s.opacity?.min),
            max: getValueInSettingsOrUseDefault(s => s.opacity?.max),
            step: getValueInSettingsOrUseDefault(s => s.opacity?.step),
        },
    
        thickness: {
            min: getValueInSettingsOrUseDefault(s => s.thickness?.min),
            max: getValueInSettingsOrUseDefault(s => s.thickness?.min),
            step: getValueInSettingsOrUseDefault(s => s.thickness?.step),
        },
    
        shape: {
            shapes: getValueInSettingsOrUseDefault(s => s.shape?.shapes)
        }      
    }
}