import { BLACK, WHITE } from "../../../utilities/Color";
import { DeepOptionalProperties } from "../../../utilities/types";
import { ValueWithUnit } from "../../../utilities/ValueWithUnit";
import { FullStyle } from "./Style";

export type SpecialisedInspectorSettings = {
    showWithDefaultValues: boolean;
}

export type StyleInspectorSettings = {
    defaultStyle: FullStyle;
    inspectors: { [K in keyof FullStyle]: SpecialisedInspectorSettings };
};

export type PartialStyleInspectorSettings = DeepOptionalProperties<StyleInspectorSettings>;

export const DEFAULT_STYLE_INSPECTOR_SETTINGS: StyleInspectorSettings = {
    defaultStyle: {
        background: {
            color: WHITE
        },
        border: {
            color: BLACK,
            thickness: new ValueWithUnit(0, "px"),
            type: "solid"
        },
        font: {
            color: BLACK,
            family: ["sans-serif"],
            size: new ValueWithUnit(1, "em"),
            bold: false,
            italic: false,
            underline: false
        },
        margin: {
            inner: {
                top: new ValueWithUnit(0, "px"),
                bottom: new ValueWithUnit(0, "px"),
                left: new ValueWithUnit(0, "px"),
                right: new ValueWithUnit(0, "px")
            },
            outer: {
                top: new ValueWithUnit(0, "px"),
                bottom: new ValueWithUnit(0, "px"),
                left: new ValueWithUnit(0, "px"),
                right: new ValueWithUnit(0, "px")
            }
        },
    },

    inspectors: {
        background: { showWithDefaultValues: true },
        border: { showWithDefaultValues: true },
        font: { showWithDefaultValues: true },
        margin: { showWithDefaultValues: true }
    }
};

export function deriveStyleInspectorSettingsFromDefaults(settings: PartialStyleInspectorSettings): StyleInspectorSettings {
    function getStylePropertiesInSettingsOrUseDefault<K extends keyof FullStyle>(key: K): FullStyle[K] {
        return {
            ...DEFAULT_STYLE_INSPECTOR_SETTINGS.defaultStyle[key],
            ...settings.defaultStyle![key] ?? {}
        };
    }

    function getInspectorPropertiesInSettingsOrUseDefault<K extends keyof FullStyle>(key: K): StyleInspectorSettings["inspectors"][K] {
        return {
            ...DEFAULT_STYLE_INSPECTOR_SETTINGS.inspectors[key],
            ...settings.inspectors![key] ?? {}
        };
    }

    if (!settings.defaultStyle && !settings.inspectors) {
        return DEFAULT_STYLE_INSPECTOR_SETTINGS;
    }

    return {
        defaultStyle: !settings.defaultStyle ? DEFAULT_STYLE_INSPECTOR_SETTINGS.defaultStyle : {
            background: getStylePropertiesInSettingsOrUseDefault("background"),
            border: getStylePropertiesInSettingsOrUseDefault("border"),
            font: getStylePropertiesInSettingsOrUseDefault("font"),
            margin: getStylePropertiesInSettingsOrUseDefault("margin"),
        },

        inspectors: !settings.inspectors ? DEFAULT_STYLE_INSPECTOR_SETTINGS.inspectors : {
            background: getInspectorPropertiesInSettingsOrUseDefault("background"),
            border: getInspectorPropertiesInSettingsOrUseDefault("border"),
            font: getInspectorPropertiesInSettingsOrUseDefault("font"),
            margin: getInspectorPropertiesInSettingsOrUseDefault("margin"),
        }
    };
}