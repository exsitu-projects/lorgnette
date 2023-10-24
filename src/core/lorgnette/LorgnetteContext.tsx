import React from "react";
import { Language } from "../languages/Language";
import { Document } from "../documents/Document";
import { ABSOLUTE_ORIGIN_POSITION, Position } from "../documents/Position";
import { EMPTY_RANGE, Range } from "../documents/Range";
import { ProjectionProvider } from "../projections/ProjectionProvider";
import { ConfigurableRendererProvider, RendererProvider } from "../renderers/RendererProvider";
import { ConfigurableUserInterfaceProvider, UserInterfaceProvider } from "../user-interfaces/UserInterfaceProvider";
import { PLAIN_TEXT_LANGUAGE } from "../languages/plain-text";
import { LorgnetteEnvironmentState } from "./LorgnetteEnvironment";
import { ProjectionSpecification } from "../projections/ProjectionSpecification";

// Create the React context that will be provided by the Projection environment.
// Note: the object contains default values; the actual values will be in
// the Projection environment provider's state.
export const LorgnetteContext = React.createContext<LorgnetteEnvironmentState>({
    codeEditorCursorPosition: ABSOLUTE_ORIGIN_POSITION,
    setCodeEditorCursorPosition: (position: Position) => {},
  
    codeEditorVisibleRange: EMPTY_RANGE,
    setCodeEditorVisibleRange: (range: Range) => {},
  
    codeEditorHoveredRanges: [],
    setCodeEditorHoveredRanges: (ranges: Range[]) => {},
  
    codeEditorSelectedRanges: [],
    setCodeEditorSelectedRanges: (ranges: Range[]) => {},
  
    document: new Document(PLAIN_TEXT_LANGUAGE, ""),
    setDocument: (document: Document) => {},
    setDocumentContent: (content: string) => {},
    
    languages: [],
    registerLanguage: (language: Language) => {},
    unregisterLanguage: (name: string) => {},

    userInterfaceNamesToConfigurableProviders: new Map(),
    registerUserInterface: (name: string, configurableProvider: ConfigurableUserInterfaceProvider) => {},
    unregisterUserInterface: (name: string) => {},
  
    rendererNamesToConfigurableProviders: new Map(),
    registerRenderer: (name: string, configurableProvider: ConfigurableRendererProvider) => {},
    unregisterRenderer: (name: string) => {},
  
    projectionProviders: [],
    registerProjection: (specification: ProjectionSpecification) => {},
    unregisterProjection: (name: string) => {},

    projections: []
});

LorgnetteContext.displayName = "Lorgnette context";
