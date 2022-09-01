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
import { Debouncer } from "./utilities/tasks/Debouncer";

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
  private monocleUpdateDebouncer: Debouncer;
  private readonly documentChangeObserver = {
    processChange: (event: DocumentChangeEvent) => this.onDocumentChange(event)
  };

  constructor(props: MonocleEnvironmentProviderProps) {
    super(props);

    const initialMonocleUpdateDebounceDelay = 100; // ms
    this.monocleUpdateDebouncer = new Debouncer(initialMonocleUpdateDebounceDelay);

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

  // This method must return the minimum time (in milliseconds)
  // to wait before updating the monocles upon request, so as to
  // debounce the update if another request occurs before it happens.
  protected updateMonocleUpdateDebounceDelayForDocument(document: Document): void {
    // Heuristic to improve performance based on the length of the document.
    const documentLength = document.nbCharacters;
    const debounceDelay =
      documentLength < 1000 ? 100 : // Less than 1,000 characters
      documentLength < 10000 ? 500 : // Less than 10,000 characters
        1000 // Over 10,000 characters
    
    this.monocleUpdateDebouncer.minimumDelayBetweenTasks = debounceDelay;
  }

  // The purpose of this method is to provide a callback for state changes
  // that can be used in child classes extending this environment provider.
  // Note: Partial<MonocleEnvironment> should work here (?), but it does not match
  // the signature of setSate provided by React, hence the more complex Pick type.
  protected setEnvironment<K extends keyof MonocleEnvironment>(
    environmentChanges: Pick<MonocleEnvironment, K>
  ): void {
    this.setState(environmentChanges);
    this.onEnvironmentDidChange(environmentChanges);
  }

  // Callback that can be extended by child classes extending this class.
  // Note that child classes must call super.onEnvironmentDidChange!
  // See the setEnvironment method for details.
  protected onEnvironmentDidChange(environmentChanges: Partial<MonocleEnvironment>): void {
    if (environmentChanges.document) {
      this.updateMonocleUpdateDebounceDelayForDocument(environmentChanges.document);
    }
  }

  protected setCodeEditorCursorPosition(newPosition: Position): void {
    this.setEnvironment({
      codeEditorCursorPosition: newPosition
    });
  }

  protected setCodeEditorRanges(newRanges: Partial<CodeEditorRanges>): void {
    this.setEnvironment({
      codeEditorRanges: { ...this.state.codeEditorRanges, ...newRanges }
    });
  }

  protected setDocument(newDocument: Document): void {
    // Update the document change observers.
    this.state.document.removeChangeObserver(this.documentChangeObserver)
    newDocument.addChangeObserver(this.documentChangeObserver);

    this.setEnvironment({
      document: newDocument
    });

    // Create monocles for the new document.
    this.requestMonocleUpdateForDocument(newDocument);
  }

  protected setDocumentContent(newContent: string): void {
    this.setDocument(new Document(this.state.document.language, newContent));
  }

  protected createDocumentFromExample(example: Example): Document {
    const document = new Document(example.language, example.content);
    document.addChangeObserver(this.documentChangeObserver);

    return document;
  }

  protected onDocumentChange(event: DocumentChangeEvent): void {
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

    this.setState({
      document: newDocument
    });
    
    // If the change originates from a monocle, it might have to be preserved.
    // In this case, monocle providers should take it into account when creating new monocles.
    let monocleToPreserve = undefined;
    if (event.changeContext.origin === DocumentChangeOrigin.Monocle && event.changeContext.preservesMonocle) {
      monocleToPreserve = event.changeContext.monocle;
      monocleToPreserve.state.isActive = true; // TODO: this should already be done elsewhere!
    }

    this.requestMonocleUpdateForDocument(newDocument, monocleToPreserve);
  }

  // Create new monocles for the given document.
  protected async createMonoclesForDocument(document: Document, monocleToPreserve?: Monocle): Promise<Monocle[]> {
    const monocles: Monocle[] = [];

    for (let monocleProvider of this.state.monocleProviders) {
      // If a monocle to preserve is provided, the monocle provider of this monocle should attempt
      // to transfer the state of this monocle to the best match among the new monocles it provides.
      const useMonocleToPreserve = monocleToPreserve && monocleToPreserve.provider === monocleProvider;
      
      monocles.push(...await monocleProvider.provideForDocument(
        document,
        useMonocleToPreserve ? monocleToPreserve : undefined
      ));
    }

    console.log("[ New monocles ]", monocles);
    return monocles;
  }

  protected requestMonocleUpdateForDocument(document: Document, monocleToPreserve?: Monocle): void {
    this.monocleUpdateDebouncer.addTask(async () => {
      const newMonocles = await this.createMonoclesForDocument(document, monocleToPreserve);
      this.setEnvironment({ monocles: newMonocles });
    });
  }

  componentDidMount(): void {
    this.updateMonocleUpdateDebounceDelayForDocument(this.state.document);
    this.requestMonocleUpdateForDocument(this.state.document);
  }

  render() {
    return <MonocleEnvironmentContext.Provider value={this.state}>
      {this.props.children}
    </MonocleEnvironmentContext.Provider>;
  }
}
