import { CodeVisualisationProvider } from "../core/visualisations/CodeVisualisationProvider";
import { cssPropertyStyleInspectorProvider } from "./css-properties";
import { hexadecimalColorCodeVisualisationProvider } from "./hexadecimal-color-codes";
import { matplotlibTextPropertySetterStyleInspectorProvider } from "./matplotlib-text-properties";
import { regexConstructorVisualisationProvider } from "./regex-constructors";
import { regexLiteralVisualisationProvider } from "./regex-literals";
import { syntacticRgbColorConstructorVisualisationProvider, textualRgbColorConstructorVisualisationProvider } from "./rgb-color-constructors";
import { seabornBarplotStyleInspectorProvider } from "./seaborn-plots";
import { tsxComponentVisualisationProvider } from "./tsx-components";
import { vegaMarksStyleEditorProvider, vegaMarksStyleInspectorProvider } from "./vega-marks";

export const CODE_VISUALISATION_PROVIDERS: CodeVisualisationProvider[] = [
    hexadecimalColorCodeVisualisationProvider,
    textualRgbColorConstructorVisualisationProvider,
    // syntacticRgbColorConstructorVisualisationProvider,

    tsxComponentVisualisationProvider,

    regexLiteralVisualisationProvider,
    regexConstructorVisualisationProvider,

    // vegaMarksStyleEditorProvider,
    vegaMarksStyleInspectorProvider,

    cssPropertyStyleInspectorProvider,

    seabornBarplotStyleInspectorProvider,
    matplotlibTextPropertySetterStyleInspectorProvider
];