import React, { ReactElement } from "react";
import "./monocle-environment.css";
import { SUPPORTED_LANGUAGES } from "./core/languages/Language";
import { Document, DocumentChangeEvent, DocumentChangeOrigin } from "./core/documents/Document";
import { ABSOLUTE_ORIGIN_POSITION, Position } from "./core/documents/Position";
import { DEFAULT_EXAMPLE, Example } from "./ui/playground/examples/Example";
import { MONOCLE_PROVIDERS } from "./monocle-providers/providers";
import { Monocle } from "./core/monocles/Monocle";
import { MonocleProvider } from "./core/monocles/MonocleProvider";
import { EMPTY_RANGE, Range } from "./core/documents/Range";

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES[0];

// Define the type and the default value of a set of ranges of interest in the code editor.
export interface CodeEditorRanges {
  visible: Range,
  hovered: Range[],
  selected: Range[]
}

export const DEFAULT_CODE_EDITOR_RANGES: CodeEditorRanges = {
  visible: EMPTY_RANGE,
  hovered: [],
  selected: []
};

// Define the type of a Monocle environement.
export interface MonocleEnvironment {
  codeEditorCursorPosition: Position;
  updateCodeEditorCursorPosition(newPosition: Position): void;

  codeEditorRanges: CodeEditorRanges;
  updateCodeEditorRanges(ranges: Partial<CodeEditorRanges>): void;

  document: Document;
  updateDocument(newDocument: Document): void;
  updateDocumentContent(newContent: string): void;
  
  monocleProviders: MonocleProvider[];
  monocles: Monocle[];
};

// Define the types of the props and the state of a Monocle environment provider.
export interface MonocleEnvironmentProviderProps {
  
};

export type MonocleEnvironmentProviderState = MonocleEnvironment;

// Create the React context that will be provided by the Monocle environment.
// Note: the object contains default values; the actual values will be in the Monocle environment provider's state.
export const MonocleEnvironmentContext = React.createContext<MonocleEnvironment>({
  codeEditorCursorPosition: ABSOLUTE_ORIGIN_POSITION,
  updateCodeEditorCursorPosition: (newPosition: Position) => {},

  codeEditorRanges: DEFAULT_CODE_EDITOR_RANGES,
  updateCodeEditorRanges: (ranges: Partial<CodeEditorRanges>) => {},

  document: new Document(DEFAULT_LANGUAGE, ""),
  updateDocument: (newDocument: Document) => {},
  updateDocumentContent: (newContent: string) => {},
  
  monocleProviders: [] as MonocleProvider[],
  monocles: [] as Monocle[],
});

MonocleEnvironmentContext.displayName = "Monocle environment";

export class MonocleEnvironmentProvider extends React.Component<
  MonocleEnvironmentProviderProps,
  MonocleEnvironmentProviderState
> {
  private readonly documentChangeObserver = {
    processChange: (event: DocumentChangeEvent) => this.onDocumentChange(event)
  };

  constructor(props: MonocleEnvironmentProviderProps) {
    super(props);

    this.state = {
      codeEditorCursorPosition: ABSOLUTE_ORIGIN_POSITION,
      updateCodeEditorCursorPosition: newPosition => this.setCodeEditorCursorPosition(newPosition),

      codeEditorRanges: DEFAULT_CODE_EDITOR_RANGES,
      updateCodeEditorRanges: newRanges => this.setCodeEditorRanges(newRanges),

      document: this.createDocumentFromExample(DEFAULT_EXAMPLE),
      updateDocument: newDocument => this.setDocument(newDocument),
      updateDocumentContent: newContent => this.setDocumentContent(newContent),

      monocleProviders: MONOCLE_PROVIDERS,
      monocles: []
    };
  }

  private setCodeEditorCursorPosition(newPosition: Position): void {
    this.setState({
      codeEditorCursorPosition: newPosition
    });
  }

  private setCodeEditorRanges(newRanges: Partial<CodeEditorRanges>): void {
    this.setState({
      codeEditorRanges: { ...this.state.codeEditorRanges, ...newRanges }
    });
  }

  private setDocument(newDocument: Document): void {
    // Update the document change observers.
    this.state.document.removeChangeObserver(this.documentChangeObserver)
    newDocument.addChangeObserver(this.documentChangeObserver);

    // Create monocles for the new document.
    const newMonocles = this.createMonoclesForDocument(newDocument);

    this.setState({
      document: newDocument,
      monocles: newMonocles
    });
  }

  private setDocumentContent(newContent: string): void {
    this.setDocument(new Document(this.state.document.language, newContent));
  }

  private createDocumentFromExample(example: Example): Document {
    const document = new Document(example.language, example.content);
    document.addChangeObserver(this.documentChangeObserver);

    return document;
  }

  private onDocumentChange(event: DocumentChangeEvent): void {
    // If the change is transient, the document should only be modified internally until the transient state ends,
    // without recreating a new document for each successive transient change.
    if (event.changeContext.origin === DocumentChangeOrigin.Monocle && event.changeContext.isTransientChange) {
      return;
    }

    // Create a new document based on the current one.
    const newDocument = new Document(
      this.state.document.language,
      event.document.content
    );

    // Update the document change observers.
    this.state.document.removeChangeObserver(this.documentChangeObserver);
    newDocument.addChangeObserver(this.documentChangeObserver);
    
    // If the change originates from a monocle, it might have to be preserved.
    // In this case, monocle providers should take it into account when creating new monocles.
    // new monocles should preserve the state of this monocle.
    let monocleToPreserve = undefined;
    if (event.changeContext.origin === DocumentChangeOrigin.Monocle && event.changeContext.preservesMonocle) {
      monocleToPreserve = event.changeContext.monocle;
      monocleToPreserve.state.isActive = true; // TODO: this should already be done elsewhere!
    }

    const newMonocles = this.createMonoclesForDocument(newDocument, monocleToPreserve);

    this.setState({
      document: newDocument,
      monocles: newMonocles
    });
  }

  // Create new monocles for the given document.
  private createMonoclesForDocument(document: Document, monocleToPreserve?: Monocle): Monocle[] {
    const monocles: Monocle[] = [];

    for (let monocleProvider of this.state.monocleProviders) {
      // If a monocle to preserve is provided, the monocle provider of this monocle should attempt
      // to transfer the state of this monocle to the best match among the new monocles it provides.
      const useMonocleToPreserve = monocleToPreserve && monocleToPreserve.provider === monocleProvider;
      
      monocles.push(...monocleProvider.provideForDocument(
        document,
        useMonocleToPreserve ? monocleToPreserve : undefined
      ));
    }

    console.log("[ New monocles ]", monocles);

    return monocles;
  }

  componentDidMount(): void {
    this.setState({
      monocles: this.createMonoclesForDocument(this.state.document)
    });
  }

  render() {
    return <MonocleEnvironmentContext.Provider value={this.state}>
      {this.props.children}
    </MonocleEnvironmentContext.Provider>;
  }
}
