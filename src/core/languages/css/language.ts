import { Language } from "../Language";
import { CssParser } from "./CssParser";

export const CSS_LANGUAGE: Language = {
    name: "CSS",
    id: "css",
    codeEditorLanguageId: "css",
    parser: new CssParser()
};