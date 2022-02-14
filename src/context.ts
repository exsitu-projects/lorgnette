import React from "react";
import { Document } from "./core/documents/Document";
import { ABSOLUTE_ORIGIN_POSITION, Position } from "./core/documents/Position";
import { Range } from "./core/documents/Range";
import { Language, SUPPORTED_LANGUAGES } from "./core/languages/Language";
import { CodeVisualisation } from "./core/visualisations/CodeVisualisation";
import { CodeVisualisationProvider } from "./core/visualisations/CodeVisualisationProvider";

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES[0];

export interface CodeEditorRanges {
  hovered: Range[],
  selected: Range[]
}

export const defaultCodeEditorRanges: CodeEditorRanges = {
  hovered: [],
  selected: []
};

export const defaultGlobalContext = {
  codeEditorLanguage: DEFAULT_LANGUAGE,
  updateCodeEditorLanguage: (newlanguage: Language) => {},

  codeEditorCursorPosition: ABSOLUTE_ORIGIN_POSITION,
  updateCodeEditorCursorPosition: (newPosition: Position) => {},

  codeEditorRanges: defaultCodeEditorRanges,
  updateCodeEditorRanges: (ranges: Partial<CodeEditorRanges>) => {},

  document: new Document(DEFAULT_LANGUAGE, DEFAULT_LANGUAGE.codeExample),
  updateDocumentContent: (newContent: string) => {},
  
  codeVisualisationProviders: [] as CodeVisualisationProvider[],
  codeVisualisations: [] as CodeVisualisation[],
  // updateCodeVisualisations: (newVisualisations: []) => {},

  declareCodeVisualisationMutation: () => {}
};

export type GlobalContextContent = typeof defaultGlobalContext;

export const GlobalContext = React.createContext(defaultGlobalContext);
GlobalContext.displayName = "Monocle global context";