import { Language } from "../../../core/languages/Language";
import { JsonParser } from "./JsonParser";

export const JSON_LANGUAGE: Language = {
    name: "JSON",
    id: "json",
    codeEditorLanguageId: "json",
    parser: new JsonParser()
};