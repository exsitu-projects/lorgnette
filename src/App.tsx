import React from "react";
import "./App.css";
import { Tab, Tabs } from "@blueprintjs/core";
import CodeEditorPanel from "./components/panels/CodeEditorPanel";
import VisualisationProvidersConfigurationPanel from "./components/panels/VisualisationConfigurationPanel";
import { GlobalContext, GlobalContextContent } from "./context";
import { Language, SUPPORTED_LANGUAGES } from "./core/languages/Language";
import { RangeSiteProvider } from "./core/sites/textual/RangeSiteProvider";
import { CodeVisualisation } from "./core/visualisations/CodeVisualisation";
import { RegexPatternFinder } from "./core/code-patterns/textual/RegexPatternFinder";
import { TextualCodeVisualisationProvider } from "./core/visualisations/textual/TextualCodeVisualisationProvider";
import { ProgrammableMapping } from "./core/mappings/ProgrammableMapping";
import { ColorPickerProvider } from "./core/user-interfaces/color-picker/ColorPickerProvider";
import { Document, DocumentChangeOrigin } from "./core/documents/Document";
import { RegexSiteProvider } from "./core/sites/textual/RegexSiteProvider";
import { MathParser } from "./core/languages/math/MathParser";

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

      document: this.createDocument(defaultLanguage, defaultLanguage.codeExample),
      updateDocumentContent: newContent => {
        this.updateDocumentContent(newContent);
        this.updateAllCodeVisualisations();
      },

      codeVisualisationProviders: [
        new TextualCodeVisualisationProvider(
          "RGB Color constructor",
          new RegexPatternFinder("Color\\((\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\)"),
          [
            // (?<=) is a non-capturing lookbehind; (?=) is a non-capturing lookahead.
            new RegexSiteProvider("(?<=Color\\()(\\d+)"),
            new RegexSiteProvider("(?<=Color\\([^,]+,\\s*)(\\d+)"),
            new RegexSiteProvider("(?<=Color\\([^,]+,[^,]+,\\s*)(\\d+)"),
          ],
          new ProgrammableMapping(`
            return {
              r: parseInt(args.sites[0].text),
              g: parseInt(args.sites[1].text),
              b: parseInt(args.sites[2].text)
            };
          `),
          new ProgrammableMapping(`
            console.log('Output mapping: ', args);

            const data = args.output.data;
            const documentEditor = args.documentEditor;
            const pattern = args.pattern;
            const sites = args.sites;

            const adaptSiteRange = range => range.relativeTo(pattern.range.start);
            const padRgbValue = n => n.toString().padStart(3, "0");

            documentEditor.replace(adaptSiteRange(sites[0].range), data.r.toString());
            documentEditor.replace(adaptSiteRange(sites[1].range) ,data.g.toString());
            documentEditor.replace(adaptSiteRange(sites[2].range), data.b.toString());
            
            documentEditor.applyEdits();
          `),
          new ColorPickerProvider()
        ),
        new TextualCodeVisualisationProvider(
          "Hexadecimal color code",
          new RegexPatternFinder("#([a-fA-F0-9]{6})"),
          [
            new RangeSiteProvider(1, 2),
            new RangeSiteProvider(3, 4),
            new RangeSiteProvider(5, 6),
          ],
          new ProgrammableMapping(`
            return {
              r: parseInt(args.sites[0].text, 16),
              g: parseInt(args.sites[1].text, 16),
              b: parseInt(args.sites[2].text, 16)
            };
          `),
          new ProgrammableMapping(`
            console.log('Output mapping: ', args);

            const data = args.output.data;
            const documentEditor = args.documentEditor;
            const pattern = args.pattern;
            const sites = args.sites;

            const adaptSiteRange = range => range.relativeTo(pattern.range.start);
            const hexOfRgbValue = n => n.toString(16);

            documentEditor.replace(adaptSiteRange(sites[0].range), hexOfRgbValue(data.r));
            documentEditor.replace(adaptSiteRange(sites[1].range), hexOfRgbValue(data.g));
            documentEditor.replace(adaptSiteRange(sites[2].range), hexOfRgbValue(data.b));
            
            documentEditor.applyEdits();
          `),
          new ColorPickerProvider()
        ),
      ],
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
            event.changeContext.visualisation.updateCodeBinding();
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
