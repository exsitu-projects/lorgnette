import { BackgroundProperties } from "./inspectors/BackgroundInspector";
import { BorderProperties } from "./inspectors/BorderInspector";
import { FontProperties } from "./inspectors/FontInspector";
import { MarginProperties } from "./inspectors/MarginInspector";

export type Style = {
    background?: BackgroundProperties;
    border?: BorderProperties;
    font?: FontProperties;
    margin?: MarginProperties;
};

export type FullStyle = { [K in keyof Required<Style>]: Required<Style[K]>}