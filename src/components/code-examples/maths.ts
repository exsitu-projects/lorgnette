import { Document } from "../../core/documents/Document";
import { MATHEMATICS_LANGUAGE } from "../../core/languages/math/language";

const text = `
1 + e^(sin(pi) + cos(pi)) * 123.456
`;

export const MATH_EXAMPLE = {
    name: "Maths",
    document: new Document(MATHEMATICS_LANGUAGE, text.trim())
};