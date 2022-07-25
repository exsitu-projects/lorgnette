import React from "react";
import { Document } from "./core/documents/Document";
import { ABSOLUTE_ORIGIN_POSITION, Position } from "./core/documents/Position";
import { EMPTY_RANGE, Range } from "./core/documents/Range";
import { Language, SUPPORTED_LANGUAGES } from "./core/languages/Language";
import { Monocle } from "./core/monocles/Monocle";
import { MonocleProvider } from "./core/monocles/MonocleProvider";

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES[0];

export interface CodeEditorRanges {
  visible: Range,
  hovered: Range[],
  selected: Range[]
}

export const defaultCodeEditorRanges: CodeEditorRanges = {
  visible: EMPTY_RANGE,
  hovered: [],
  selected: []
};

export const defaultGlobalContext = {
  codeEditorCursorPosition: ABSOLUTE_ORIGIN_POSITION,
  updateCodeEditorCursorPosition: (newPosition: Position) => {},

  codeEditorRanges: defaultCodeEditorRanges,
  updateCodeEditorRanges: (ranges: Partial<CodeEditorRanges>) => {},

  document: new Document(DEFAULT_LANGUAGE, ""),
  updateDocument: (language: Language, content: string) => {},
  updateDocumentContent: (newContent: string) => {},
  
  monocleProviders: [] as MonocleProvider[],
  monocles: [] as Monocle[],

  declareMonocleMutation: () => {}
};

export type GlobalContextContent = typeof defaultGlobalContext;

export const GlobalContext = React.createContext(defaultGlobalContext);
GlobalContext.displayName = "Monocle global context";