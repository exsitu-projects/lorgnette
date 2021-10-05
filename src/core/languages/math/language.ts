import { MathParser } from "./MathParser";

const codeExample = 
`
1 + e^(sin(pi) + cos(pi)) * 123.456
`;

export const MATHEMATICS_LANGUAGE = {
    name: "Mathematics",
    key: "mathematics",
    codeEditorLanguageId: "javascript",
    codeExample: codeExample.trim(),
    parser: new MathParser()
};