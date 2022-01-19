import React from "react";
import "./App.css";
import CodeEditorPanel from "./components/panels/CodeEditorPanel";
import VisualisationProvidersConfigurationPanel from "./components/panels/VisualisationConfigurationPanel";
import { defaultCodeEditorRanges, GlobalContext, GlobalContextContent } from "./context";
import { Language, SUPPORTED_LANGUAGES } from "./core/languages/Language";
import { RangeSiteProvider } from "./core/sites/textual/RangeSiteProvider";
import { CodeVisualisation } from "./core/visualisations/CodeVisualisation";
import { RegexPatternFinder } from "./core/code-patterns/textual/RegexPatternFinder";
import { TextualCodeVisualisationProvider } from "./core/visualisations/textual/TextualCodeVisualisationProvider";
import { ColorPickerProvider } from "./core/user-interfaces/color-picker/ColorPickerProvider";
import { Document, DocumentChangeOrigin } from "./core/documents/Document";
import { RegexSiteProvider } from "./core/sites/textual/RegexSiteProvider";
import { SyntacticCodeVisualisationProvider } from "./core/visualisations/syntactic/SyntacticCodeVisualisationProvider";
import { AstPatternFinder } from "./core/code-patterns/syntactic/AstPatternFinder";
import { AstPattern } from "./core/languages/AstPattern";
import { FunctionNode } from "./core/languages/math/nodes/FunctionNode";
import { InputPrinterProvider } from "./core/user-interfaces/input-printer/InputPrinterProvider";
import { Tabs, Tab } from "@blueprintjs/core";
import { ProgrammableSiteProvider } from "./core/sites/syntactic/ProgrammableSiteProvider";
import { ProgrammableInputMapping } from "./core/mappings/ProgrammableInputMapping";
import { ProgrammableOutputMapping } from "./core/mappings/ProgrammableOutputMapping";
import { Range } from "./core/documents/Range";
import { TreeProvider } from "./core/user-interfaces/tree/TreeProvider";
import { SyntacticPattern } from "./core/code-patterns/syntactic/SyntacticPattern";
import { AstNode } from "./core/languages/AstNode";
import { Output, TreeNode } from "./core/user-interfaces/tree/Tree";
import { NodeMoveProcesser } from "./core/user-interfaces/tree/utilities/NodeMoveProcesser";

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
          new ProgrammableInputMapping(arg => {
            return {
              r: parseInt(arg.sites[0].text),
              g: parseInt(arg.sites[1].text),
              b: parseInt(arg.sites[2].text)
            };
          }),
          new ProgrammableOutputMapping(arg => {
            console.log('Output mapping: ', arg);

            const data = arg.output.data;
            const documentEditor = arg.output.editor;
            const pattern = arg.pattern;
            const sites = arg.sites;

            console.info(documentEditor)

            const adaptSiteRange = (range: Range) => range.relativeTo(pattern.range.start);
            // const padRgbValue = n => n.toString().padStart(3, "0");

            documentEditor.replace(adaptSiteRange(sites[0].range), data.r.toString());
            documentEditor.replace(adaptSiteRange(sites[1].range) ,data.g.toString());
            documentEditor.replace(adaptSiteRange(sites[2].range), data.b.toString());
            
            documentEditor.applyEdits();
          }),
          new ColorPickerProvider()
        ),

        // new TextualCodeVisualisationProvider(
        //   "Hexadecimal color code",
        //   new RegexPatternFinder("#([a-fA-F0-9]{6})"),
        //   [
        //     new RangeSiteProvider(1, 2),
        //     new RangeSiteProvider(3, 4),
        //     new RangeSiteProvider(5, 6),
        //   ],
        //   new ProgrammableMapping(`
        //     return {
        //       r: parseInt(arg.sites[0].text, 16),
        //       g: parseInt(arg.sites[1].text, 16),
        //       b: parseInt(arg.sites[2].text, 16)
        //     };
        //   `),
        //   new ProgrammableMapping(`
        //     console.log('Output mapping: ', arg);

        //     const data = arg.output.data;
        //     const documentEditor = arg.documentEditor;
        //     const pattern = arg.pattern;
        //     const sites = arg.sites;

        //     const adaptSiteRange = range => range.relativeTo(pattern.range.start);
        //     const hexOfRgbValue = n => n.toString(16);

        //     documentEditor.replace(adaptSiteRange(sites[0].range), hexOfRgbValue(data.r));
        //     documentEditor.replace(adaptSiteRange(sites[1].range), hexOfRgbValue(data.g));
        //     documentEditor.replace(adaptSiteRange(sites[2].range), hexOfRgbValue(data.b));
            
        //     documentEditor.applyEdits();
        //   `),
        //   new ColorPickerProvider()
        // ),

        // new SyntacticCodeVisualisationProvider(
        //   "Math. function calls",
        //   new AstPatternFinder(new AstPattern(n => n.type === FunctionNode.type)),
        //   [],
        //   new ProgrammableMapping(`return arg;`),
        //   null,
        //   new InputPrinterProvider()
        // ),

        // new SyntacticCodeVisualisationProvider(
        //   "RGB Color constructor — Syntactic",
        //   new AstPatternFinder(new AstPattern(n => 
        //        n.type === "NewExpression"
        //     && n.childNodes[1].parserNode.escapedText === "Color"
        //     && n.childNodes[3].childNodes.filter(c => c.type === "FirstLiteralToken").length === 3
        //   )),
        //   [
        //     new ProgrammableSiteProvider(p => p.node.childNodes[3].childNodes.filter(c => c.type === "FirstLiteralToken")[0]),
        //     new ProgrammableSiteProvider(p => p.node.childNodes[3].childNodes.filter(c => c.type === "FirstLiteralToken")[1]),
        //     new ProgrammableSiteProvider(p => p.node.childNodes[3].childNodes.filter(c => c.type === "FirstLiteralToken")[2])
        //   ],
        //   new ProgrammableInputMapping(arg => {
        //     const sites = arg.sites;

        //     return {
        //       r: parseInt(sites[0].text),
        //       g: parseInt(sites[1].text),
        //       b: parseInt(sites[2].text)
        //     };
        //   }),
        //   new ProgrammableOutputMapping(arg => {
        //     console.log('Output mapping: ', arg);

        //     const data = arg.output.data;
        //     const documentEditor = arg.output.editor;
        //     const sites = arg.sites;

        //     documentEditor.replace(sites[0].range, data.r.toString());
        //     documentEditor.replace(sites[1].range ,data.g.toString());
        //     documentEditor.replace(sites[2].range, data.b.toString());
            
        //     documentEditor.applyEdits();
        //   }),
        //   new ColorPickerProvider()
        // )

        new SyntacticCodeVisualisationProvider(
          "TSX elements",
          new AstPatternFinder(new AstPattern(
            n => ["JsxElement", "JsxSelfClosingElement"].includes(n.type),
            n => ["JsxElement", "JsxSelfClosingElement"].includes(n.type)
          )),
          [],
          new ProgrammableInputMapping(arg => {
            const pattern = arg.pattern as SyntacticPattern;

            const getJsxElementNameFromNode = (node: AstNode, defaultName: string): string => {
              const regex = /<\s*(\w+).*/;
              const regexMatch = regex.exec(node.parserNode.getFullText() as string);

              return regexMatch ? regexMatch[1] : defaultName;
            };

            const abbreviateJsxElementContent = (node: AstNode): string => {
              return node.parserNode.getFullText() as string;
            };

            const findTsxTreeItems = (node: AstNode): TreeNode<AstNode> | null => {
              let jsxElementName = "";

              const createNode = (title: string, preTitle: string) => {
                return {
                  title: title,
                  preTitle: preTitle,
                  data: node,
                  canMove: true
                };
              };

              switch (node.type) {
                case "JsxElement":
                  jsxElementName = getJsxElementNameFromNode(node, "<JSX element>");
                  const syntaxListNodes = node.childNodes.find(n => n.type === "SyntaxList");

                  return {
                    ...createNode(jsxElementName, "</>"),
                    children: syntaxListNodes
                      ? syntaxListNodes.childNodes
                          .map(n => findTsxTreeItems(n))
                          .filter(n => n !== null) as TreeNode[]
                      : []
                    };

                case "JsxSelfClosingElement":
                  jsxElementName = getJsxElementNameFromNode(node, "<Self-closing JSX element>");
                  return createNode(jsxElementName, "</>");

                case "JsxText":
                  return node.isEmpty()
                    ? null
                    : createNode(abbreviateJsxElementContent(node), "Abc");

                case "JsxExpression":
                  return createNode(abbreviateJsxElementContent(node), "{…}");

                default:
                  return null;
              }
            }

            return findTsxTreeItems(pattern.node) as TreeNode;
          }),
          new ProgrammableOutputMapping(arg => {
            const output = arg.output as Output<AstNode>;
            NodeMoveProcesser.processTreeOutput(output, arg.document);
          }),
          new TreeProvider<AstNode>()
        )
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
