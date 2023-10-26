import { Parser } from "./Parser";

export interface Language {
  name: string;
  id: string;
  codeEditorLanguageId: string;
  parser?: Parser;
}
