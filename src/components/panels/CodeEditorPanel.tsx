import React from "react";
import "./panels.css";
import TabPanel from "./TabPanel";
import { ItemRenderer, Select } from "@blueprintjs/select";
import { Button, Label, Menu, MenuItem, Position } from "@blueprintjs/core";
import { GlobalContext } from "../../context";
import { Language, SUPPORTED_LANGUAGES } from "../../core/languages/Language";
import { Pattern } from "../../core/code-patterns/Pattern";
import { Site } from "../../core/sites/Site";
import { Range } from "../../core/documents/Range";
import { CodeVisualisationProvider } from "../../core/visualisations/CodeVisualisationProvider";
import { GenericSyntaxTreeNode } from "../syntax-tree/GenericSyntaxTreeNode";
import { Document } from "../../core/documents/Document";
import { GenericSyntaxTree } from "../syntax-tree/GenericSyntaxTree";
import { CodeRange } from "../utilities/CodeRange";
import { SyntaxTree } from "../syntax-tree/SyntaxTree";
import { AugmentedCodeEditor } from "../augmented-code-editor/AugmentedCodeEditor";
import { DEFAULT_EXAMPLE, Example, EXAMPLES } from "../code-examples/Example";
import { Popover2 } from "@blueprintjs/popover2";

type Props = {};
type State = {
  currentExample: Example;
}

export default class CodeEditorPanel extends React.Component<Props, State> {

    constructor(props: Props) {
      super(props);
      this.state = {
        currentExample: DEFAULT_EXAMPLE
      }
    }


  render() {
    const renderExampleSelectorItem: ItemRenderer<Example> = (
      example,
      { handleClick, modifiers }
    ) => {
      if (!modifiers.matchesPredicate) {
          return null;
      }

      return (
          <MenuItem
              active={modifiers.active}
              key={example.name}
              text={example.name}
              label={example.document.language.name}
              onClick={handleClick}
          />
      );
  };

    type OnExampleChange = (newExample: Example) => void;
    const ExampleSelector = (props: {
      currentExample: Example,
      onExampleChange: OnExampleChange,
    }) => {
      const menu = <Menu className="bp3-menu">
        {EXAMPLES.map(example => <MenuItem
          key={example.name}
          text={example.name}
          onClick={() => props.onExampleChange(example)}
        />)}
      </Menu>;

      return <Popover2
        content={menu}
        position="bottom"
        minimal={true}
        popoverClassName="bp3-popover"
      >
          <Button text="Load example..." rightIcon="caret-down" intent="primary" />
      </Popover2>
    };
    
    const renderLanguageSelectorItem: ItemRenderer<Language> = (
      language,
      { handleClick, modifiers }
    ) => {
      if (!modifiers.matchesPredicate) {
          return null;
      }

      return (
          <MenuItem
              active={modifiers.active}
              key={language.id}
              text={language.name}
              label={language.id}
              onClick={handleClick}
          />
      );
  };

    type OnLanguageChange = (newLanguage: Language) => void;
    const LanguageSelect = Select.ofType<Language>();
    const LanguageSelector = (props: {
      currentLanguage: Language,
      onLanguageChange: OnLanguageChange,
    }) => {
      return <LanguageSelect
        items={[...SUPPORTED_LANGUAGES]}
        itemRenderer={renderLanguageSelectorItem}
        onItemSelect={language => props.onLanguageChange(language)}
        activeItem={props.currentLanguage}
      >
        <Button text={props.currentLanguage.name} rightIcon="caret-down" />
      </LanguageSelect>
    };

    const AbsoluteSiteRangeCoords = (props: {pattern: Pattern, site: Site}) => {
      const absoluteSiteCodeRange = props.site.range.relativeTo(props.pattern.range.start);
      return <CodeRange range={absoluteSiteCodeRange} />
    }

    const CodeVisualisationDetails = (props: {
      providers: CodeVisualisationProvider[];
      document: Document
      // visualisations: CodeVisualisation[];
    }) => {
      const { providers, document } = props;

      // Only keep providers that can be used in the current document.
      const usableProviders = providers.filter(provider => provider.canBeUsedInDocument(document));

      return <ul style={{
        // margin: "0 1em",
        padding: 0,
        listStyleType: "none"
      }}>
        {usableProviders.map(provider => (
          <li>
            <h5 style={{
              padding: "1ex",
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: "2px",
              fontSize: "0.8rem"
            }}>
              {provider.name} ({provider.codeVisualisations.length} match(es))
            </h5>
            <ul style={{
              padding: 0,
              listStyleType: "none"
            }}>
              {
                provider.codeVisualisations.map(visualisation => (
                  <li>
                    {/* Range of the visualisation */}
                    <CodeRange range={visualisation.range} />

                    {/* Details about each site */}
                    {/* <strong>Sites:</strong>
                    <ul>
                      {visualisation.sites.map(site => (
                        <AbsoluteSiteRangeCoords
                          pattern={visualisation.pattern}
                          site={site}
                        />
                      ))}
                    </ul> */}

                    {/* Output of the input mapping function */}
                    {/* <strong>Input mapping:</strong>
                    <pre style={{ fontSize: 10 }}>
                      {JSON.stringify(visualisation.applyInputMapping(), undefined, 2)}
                    </pre> */}

                    {/* User interface */}
                    {/* <strong>User interface:</strong> */}
                    {visualisation.userInterface.createViewContent()}
                  </li>
                ))
              }
            </ul>
          </li>
        ))}
      </ul>
    }

    return (
      <GlobalContext.Consumer>{ context => (
        <TabPanel>
          <div style={{
            display: "grid",
            gridTemplateRows: "auto",
            gridTemplateColumns: "8fr 2fr",
            gap: "1em",
            height: "100%"
          }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div className="code-editor-menu-bar">
                <Label className="bp3-inline" style={{ margin: 0 }}>
                  Language:
                  <LanguageSelector
                    currentLanguage={context.document.language}
                    onLanguageChange={newLanguage => context.updateDocument(
                      new Document(newLanguage, context.document.content)
                    )}
                  />
                </Label>
                <ExampleSelector
                  currentExample={this.state.currentExample}
                  onExampleChange={newExample => {
                    this.setState({ currentExample: newExample });
                    context.updateDocument(new Document(
                      newExample.document.language,
                      newExample.document.content
                    ))
                  }}
                />
              </div>
              <AugmentedCodeEditor />
            </div>
            <div style={{ overflowY: "auto" }}>
              <h3>Syntax tree</h3>
              <SyntaxTree
                document={context.document}
                eventHandlers={{
                  onMouseEnterNode: (node) => { context.updateCodeEditorRanges({ hovered: [node.range] }); },
                  onMouseLeaveNode: (node) => { context.updateCodeEditorRanges({ hovered: [] }); }
                }}
              />
            </div>
            {/* <div style={{ overflowY: "auto" }}>
              <h3>Visualisations ({context.codeVisualisations.length}):</h3>
              <CodeVisualisationDetails
                providers={context.codeVisualisationProviders}
                document={context.document}
              />
            </div> */}
          </div>
        </TabPanel>
      )}</GlobalContext.Consumer>
    );
  }
};
