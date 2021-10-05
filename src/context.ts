import React from "react";
import { Document } from "./core/documents/Document";
import { Language, SUPPORTED_LANGUAGES } from "./core/languages/Language";
import { CodeVisualisation } from "./core/visualisations/CodeVisualisation";
import { CodeVisualisationProvider } from "./core/visualisations/CodeVisualisationProvider";

export const defaultGlobalContext = {
  codeEditorLanguage: SUPPORTED_LANGUAGES[0],
  updateCodeEditorLanguage: (newlanguage: Language) => {},
  
  document: new Document(),
  updateDocumentContent: (newContent: string) => {},
  
  codeVisualisationProviders: [] as CodeVisualisationProvider[],
  codeVisualisations: [] as CodeVisualisation[],
  // updateCodeVisualisations: (newVisualisations: []) => {},

  declareCodeVisualisationMutation: () => {}
};

export type GlobalContextContent = typeof defaultGlobalContext;

export const GlobalContext = React.createContext(defaultGlobalContext);
GlobalContext.displayName = "Monocle global context";