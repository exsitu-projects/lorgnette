import React from "react";
import "./App.css";
import { defaultCodeEditorRanges, GlobalContext, GlobalContextContent } from "./context";
import { Language } from "./core/languages/Language";
import { CodeVisualisation } from "./core/visualisations/CodeVisualisation";
import { Document, DocumentChangeOrigin } from "./core/documents/Document";
import { ABSOLUTE_ORIGIN_POSITION, Position } from "./core/documents/Position";
import { DEFAULT_EXAMPLE } from "./ui/main-code-editor/code-examples/Example";
import { MonocleUI } from "./ui/MonocleUI";
import { CODE_VISUALISATION_PROVIDERS } from "./visualisation-providers/providers";

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
        const newCodeVisualisations = this.createNewCodeVisualisationsForDocument(newDocument);

        this.setState({
          document: newDocument,
          codeVisualisations: newCodeVisualisations
        });        
      },
      updateDocumentContent: newContent => {
        this.state.updateDocument(this.state.document.language, newContent);
      },

      codeVisualisationProviders: CODE_VISUALISATION_PROVIDERS,
      codeVisualisations: [],

      declareCodeVisualisationMutation: () => {
        const newCodeVisualisations = this.createNewCodeVisualisationsForDocument(this.state.document);

        this.setState({
          codeVisualisations: newCodeVisualisations
        });
      }
    };
  }
  
  // Create a new document in the given language, with the given content,
  // with a change observer that updates the document and the code visualisations
  // in the state of whenever the document is modified.
  private createDocument(language: Language, content: string): Document {
    const document = new Document(language, content);
    document.addChangeObserver({
      processChange: event => {
        const newDocument = this.createDocument(this.state.document.language, event.document.content);

        // Case 1: if the change originates from a manual edit operation
        // performed by the user, update the code visualisations.
        if (event.changeContext.origin === DocumentChangeOrigin.UserEdit) {
          const newCodeVisualisations = this.createNewCodeVisualisationsForDocument(newDocument);

          this.setState({
            document: newDocument,
            codeVisualisations: newCodeVisualisations
          });
        }

        // Case 2: if the change originates from a code visualisation,
        // only update the code visualisations if the change is not transient.
        else if (event.changeContext.origin === DocumentChangeOrigin.CodeVisualisationEdit) {
          if (event.changeContext.isTransientChange) {
            console.info("** TRANSIENT change **");

            this.setState({
              document: newDocument,
            });
          }
          else {
            console.warn("** NON-TRANSIENT change **");

            const newCodeVisualisations = this.createNewCodeVisualisationsForDocument(newDocument);
            this.setState({
              document: newDocument,
              codeVisualisations: newCodeVisualisations
            });
          }
        }
      }
    })

    return document;
  }

  // Create new code visualisations for the given document.
  private createNewCodeVisualisationsForDocument(document: Document): CodeVisualisation[] {
    const codeVisualisations: CodeVisualisation[] = [];
    for (let codeVisualisationProvider of this.state.codeVisualisationProviders) {
      codeVisualisationProvider.updateFromDocument(document);
      codeVisualisations.push(...codeVisualisationProvider.codeVisualisations);
    }

    console.log("new code visualisations:", codeVisualisations);

    return codeVisualisations;
  }

  // Update the code visualisations in the current document (current state).
  private updateCodeVisualisations(): void {
    this.setState({
      codeVisualisations: this.createNewCodeVisualisationsForDocument(this.state.document)
    });
  }

  componentDidMount(): void {
    // When the main app is created, visualisations must be created for the first time.
    this.updateCodeVisualisations();
  }

  render() {
    return (
      <section id="MonocleApp" style={{ height: "100vh", width: "100vw" }}>
        <GlobalContext.Provider value={this.state}>
          <MonocleUI />
        </GlobalContext.Provider>
      </section>
    );
  }
  
}
