import { MATHEMATICS_LANGUAGE } from "../../../core/languages/math/language";

const text = `
1 + e^(sin(pi) + cos(pi)) * 123.456
`;

export const MATH_EXAMPLE = {
    name: "Maths",
    language: MATHEMATICS_LANGUAGE,
    content: text.trim()
};