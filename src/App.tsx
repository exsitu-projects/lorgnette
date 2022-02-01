import React from "react";
import "./App.css";
import CodeEditorPanel from "./components/panels/CodeEditorPanel";
import VisualisationProvidersConfigurationPanel from "./components/panels/VisualisationConfigurationPanel";
import { defaultCodeEditorRanges, GlobalContext, GlobalContextContent } from "./context";
import { Language, SUPPORTED_LANGUAGES } from "./core/languages/Language";
import { CodeVisualisation } from "./core/visualisations/CodeVisualisation";
import { Document, DocumentChangeOrigin } from "./core/documents/Document";
import { Tabs, Tab } from "@blueprintjs/core";
import { DEFAULT_CODE_VISUALISATION_PROVIDERS } from "./code-visualisations-providers";

export default class App extends React.Component {
  state: GlobalContextContent;

  constructor(props: any) {
    super(props);

    const defaultLanguage = SUPPORTED_LANGUAGES[0];
    this.state = {
      codeEditorLanguage: defaultLanguage,
      updateCodeEditorLanguage: newLanguage => {
        this.setState({
          codeEditorLanguage: newLanguage,
          document : new Document(newLanguage, newLanguage.codeExample)
        });
        this.updateAllCodeVisualisations();
      },

      codeEditorRanges: defaultCodeEditorRanges,
      updateCodeEditorRanges: ranges => {
        this.setState({
          codeEditorRanges: {
            ...this.state.codeEditorRanges,
            ...ranges
          }
        })
      },

      document: this.createDocument(defaultLanguage, defaultLanguage.codeExample),
      updateDocumentContent: newContent => {
        this.updateDocumentContent(newContent);
        this.updateAllCodeVisualisations();
      },

      codeVisualisationProviders: DEFAULT_CODE_VISUALISATION_PROVIDERS,
      codeVisualisations: [],

      declareCodeVisualisationMutation: () => {
        this.updateAllCodeVisualisations();
      }
    };
  }
  
  private createDocument(language: Language, content: string): Document {
    const document = new Document(language, content);
    document.addChangeObserver({
      processChange: event => {
        this.updateDocumentContent(event.document.content);

        // Case 1: if the change originates from a manual edit operation performed by the user,
        // update all the code visualisations.
        if (event.changeContext.origin === DocumentChangeOrigin.UserEdit) {
          this.updateAllCodeVisualisations();
        }

        // Case 2: if the change originates from a code visualisation,
        // either update the binding with the code if the change is transient,
        // or update all the code visualisations otherwise.
        else if (event.changeContext.origin === DocumentChangeOrigin.CodeVisualisationEdit) {
          if (event.changeContext.isTransientChange) {
            console.info("** TRANSIENT change **");
            // event.changeContext.visualisation.updateCodeBinding();
          }
          else {
            console.warn("** NON-TRANSIENT change **");
            this.updateAllCodeVisualisations();
          }
        }
      }

    })

    return document;
  }

  private updateDocumentContent(newContent: string): void {
    const newDocument = this.createDocument(this.state.document.language, newContent);
    this.setState({ document: newDocument });
  }

  private updateAllCodeVisualisations(): void {
    // Update each code visualisation provider
    const codeVisualisations: CodeVisualisation[] = [];
    for (let codeVisualisationProvider of this.state.codeVisualisationProviders) {
      codeVisualisationProvider.updateFromDocument(this.state.document);
      codeVisualisations.push(...codeVisualisationProvider.codeVisualisations);
    }

    // Update the state
    this.setState({
      codeVisualisations: codeVisualisations
    });

    console.log("Updated visualisations", this.state.codeVisualisations);
  }

  componentDidMount(): void {
    this.updateAllCodeVisualisations();
  }

  render() {
    return (
      <section id="MonocleApp">
        <GlobalContext.Provider value={this.state}>
          <Tabs
            id="monocle-main-panel-tabs"
            className="monocle-main-panel-tabs"
            large={true}
          >
            <Tab
              id="code-editor"
              title="Code editor"
              panel={<CodeEditorPanel/>}
            />
            <Tab
              id="visualisation-configuration"
              title="Visualisation configuration"
              panel={<VisualisationProvidersConfigurationPanel/>}
            />
          </Tabs>
        </GlobalContext.Provider>
      </section>
    );
  }
  
}
