
export interface Language {
  name: string,
  key: string,
  codeExample: string;
};

export const SUPPORTED_LANGUAGES = [
  {
    name: "TypeScript",
    key: "typescript",
    codeExample:
`
const color = new Color(100, 150, 200);
const style = {
  color: #fedcba;
};
`
  }
] as const;

export type SupportedLanguages = typeof SUPPORTED_LANGUAGES[number];