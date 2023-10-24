import { Language } from "../../../core/languages/Language";
import { CSS_EXAMPLE } from "./css";
import { MARKDOWN_EXAMPLE } from "./markdown";
import { MATH_EXAMPLE } from "./maths";
import { SEABORN_EXAMPLE } from "./seaborn";
import { TYPESCRIPT_EXAMPLE } from "./typescript";
import { VEGA_EXAMPLE } from "./vega";

export interface Example {
    name: string;
    language: Language;
    content: string;
}

export const EXAMPLES: Example[] = [
    VEGA_EXAMPLE,
    TYPESCRIPT_EXAMPLE,
    MATH_EXAMPLE,
    CSS_EXAMPLE,
    SEABORN_EXAMPLE,
    MARKDOWN_EXAMPLE
];

export const DEFAULT_EXAMPLE: Example = TYPESCRIPT_EXAMPLE;