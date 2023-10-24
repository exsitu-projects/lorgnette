import { Language } from "../../../core/languages/Language";
import { TypescriptParser } from "./TypescriptParser";

export const TYPESCRIPT_LANGUAGE: Language = {
    name: "TypeScript",
    id: "typescript",
    codeEditorLanguageId: "typescript",
    parser: new TypescriptParser()
};