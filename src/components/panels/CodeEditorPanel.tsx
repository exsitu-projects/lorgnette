import React from "react";
import TabPanel from "./TabPanel";
import { ItemRenderer, Select } from "@blueprintjs/select";
import { Button, MenuItem } from "@blueprintjs/core";
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

export const LanguageSelect = Select.ofType<Language>();

export default class CodeEditorPanel extends React.PureComponent {
  render() {
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
              label={language.id}
              onClick={handleClick}
              text={language.name}
          />
      );
  };

    type OnLanguageChange = (newLanguage: Language) => void;
    const LanguageSelector = (props: {
      currentLanguage: Language,
      onLanguageChange: OnLanguageChange,
    }) => <LanguageSelect
      items={[...SUPPORTED_LANGUAGES]}
      itemRenderer={renderLanguageSelectorItem}
      onItemSelect={language => props.onLanguageChange(language)}
      activeItem={props.currentLanguage}
    >
      <Button text={props.currentLanguage.name} rightIcon="double-caret-vertical" />
    </LanguageSelect>

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
                <LanguageSelector
                  currentLanguage={context.codeEditorLanguage}
                  onLanguageChange={l => {console.log("changed", l); context.updateCodeEditorLanguage(l)}}
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
