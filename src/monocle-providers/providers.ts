import { MonocleProvider } from "../core/monocles/MonocleProvider";
import { cssPropertyStyleInspectorProvider } from "./css-properties";
import { hexadecimalColorPickerProvider, hexadecimalColorPickerProvider2 } from "./hexadecimal-color-codes";
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
import { FormTestProvider } from "./test-form";

export const MONOCLE_PROVIDERS: MonocleProvider[] = [
    // hexadecimalColorPickerProvider,
    hexadecimalColorPickerProvider2,

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
    pythonRuntimeDataframeTableProvider,

    // FormTestProvider
];
