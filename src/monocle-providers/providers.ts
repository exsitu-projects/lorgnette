import { MonocleProvider } from "../core/monocles/MonocleProvider";
import { cssPropertyStyleInspectorProvider } from "./css-properties";
import { hexadecimalColorPickerProvider } from "./hexadecimal-color-codes";
import { matplotlibTextPropertiesStyleInspectorProvider } from "./matplotlib-text-properties";
import { regexConstructorVisualisationProvider } from "./regex-constructors";
import { regexLiteralMonocleProvider } from "./regex-literals";
import { syntacticRgbConstructorColorPickerProvider, textualRgbConstructorColorPickerProvider } from "./rgb-color-constructors";
import { runtimeValueTracerProvider } from "./runtime-value-tracer";
import { seabornBarplotStyleInspectorProvider } from "./seaborn-plots";
import { markdownTableProvider } from "./markdown-tables";
import { tsxComponentTreeProvider } from "./tsx-components";
import { vegaMarksStyleInspectorProvider } from "./vega-marks";
import { pythonRuntimeDataframeTableProvider } from "./python-runtime-dataframe-tables";

export const MONOCLE_PROVIDERS: MonocleProvider[] = [
    hexadecimalColorPickerProvider,
    // textualRgbColorConstructorVisualisationProvider,
    syntacticRgbConstructorColorPickerProvider,

    tsxComponentTreeProvider,

    regexLiteralMonocleProvider,
    regexConstructorVisualisationProvider,

    vegaMarksStyleInspectorProvider,

    cssPropertyStyleInspectorProvider,

    seabornBarplotStyleInspectorProvider,
    matplotlibTextPropertiesStyleInspectorProvider,

    runtimeValueTracerProvider,
    markdownTableProvider,
    pythonRuntimeDataframeTableProvider
];
