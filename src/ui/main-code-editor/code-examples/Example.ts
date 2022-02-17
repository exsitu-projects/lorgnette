import { Document } from "../../../core/documents/Document";
import { MATH_EXAMPLE } from "./maths";
import { TYPESCRIPT_EXAMPLE } from "./typescript";
import { VEGA_EXAMPLE } from "./vega";

export interface Example {
    name: string;
    document: Document;
}

export const EXAMPLES: Example[] = [
    VEGA_EXAMPLE,
    TYPESCRIPT_EXAMPLE,
    MATH_EXAMPLE
];

export const DEFAULT_EXAMPLE: Example = VEGA_EXAMPLE;