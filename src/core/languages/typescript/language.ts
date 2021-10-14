import { TypescriptParser } from "./TypescriptParser";

const codeExample = 
`const color = new Color(100, 150, 200);
const color2 = new Color(
  255, // some comment ruining the regex
  50,
  25
);

const style = {
  color: "#fedcba"
};
`;

export const TYPESCRIPT_LANGUAGE = {
    name: "TypeScript",
    key: "typescript",
    codeEditorLanguageId: "typescript",
    codeExample: codeExample.trim(),
    parser: new TypescriptParser()
};