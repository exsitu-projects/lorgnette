import React from "react";
import "./App.css";
import { Language } from "./core/languages/Language";
import { Document, DocumentChangeOrigin } from "./core/documents/Document";
import { ABSOLUTE_ORIGIN_POSITION, Position } from "./core/documents/Position";
import { DEFAULT_EXAMPLE } from "./ui/playground/examples/Example";
import { MONOCLE_PROVIDERS } from "./monocle-providers/providers";
import { defaultCodeEditorRanges, GlobalContext, GlobalContextContent } from "./context";
import { Monocle } from "./core/monocles/Monocle";
import { Playground } from "./ui/playground/Playground";

type Props = {};
type State = GlobalContextContent;

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      codeEditorCursorPosition: ABSOLUTE_ORIGIN_POSITION,
      updateCodeEditorCursorPosition: (newPosition: Position) => {
        this.setState({
          codeEditorCursorPosition: newPosition
        });
      },

      codeEditorRanges: defaultCodeEditorRanges,
      updateCodeEditorRanges: ranges => {
        this.setState({
          codeEditorRanges: {
            ...this.state.codeEditorRanges,
            ...ranges
          }
        });
      },

      document: this.createDocument(DEFAULT_EXAMPLE.language, DEFAULT_EXAMPLE.content),
      updateDocument: (language: Language, content: string) => {
        const newDocument = this.createDocument(language, content);
        const newMonocles = this.createMonoclesForDocument(newDocument);

        this.setState({
          document: newDocument,
          monocles: newMonocles
        });        
      },
      updateDocumentContent: newContent => {
        this.state.updateDocument(this.state.document.language, newContent);
      },

      monocleProviders: MONOCLE_PROVIDERS,
      monocles: [],

      declareMonocleMutation: () => {
        const newMonocles = this.createMonoclesForDocument(this.state.document);
        this.setState({
          monocles: newMonocles
        });
      }
    };
  }
  
  // Create a new document in the given language, with the given content,
  // with a change observer that updates the document and the monocles
  // in the state of whenever the document is modified.
  private createDocument(language: Language, content: string): Document {
    const document = new Document(language, content);
    document.addChangeObserver({
      processChange: event => {
        // If the change is transient, the document should only be modified internally until the transient state ends,
        // without recreating a new document for each successive transient change.
        if (event.changeContext.origin === DocumentChangeOrigin.Monocle && event.changeContext.isTransientChange) {
          return;
        }

        const newDocument = this.createDocument(this.state.document.language, event.document.content);
        
        // If the change originates from a monocle in a monocle-preserving way,
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
    })

    return document;
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

  // Update the monocles in the current document (current state).
  private updateMonocles(): void {
    this.setState({
      monocles: this.createMonoclesForDocument(this.state.document)
    });
  }

  componentDidMount(): void {
    // When the main app is created, visualisations must be created for the first time.
    this.updateMonocles();
  }

  render() {
    return (
      <section id="monocle-playground-app">
        <GlobalContext.Provider value={this.state}>
          <Playground />
        </GlobalContext.Provider>
      </section>
    );
  }
}
