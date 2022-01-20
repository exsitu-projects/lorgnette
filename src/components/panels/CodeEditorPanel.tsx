import React from "react";
import TabPanel from "./TabPanel";
import { ItemRenderer, Select } from "@blueprintjs/select";
import { CodeEditor, createRangesToHighlightForCodeVisualisations, createRangesToHighlightFromGlobalCodeEditorRanges } from "../code-editor/CodeEditor";
import { Button, MenuItem } from "@blueprintjs/core";
import { GlobalContext } from "../../context";
import { Language, SUPPORTED_LANGUAGES } from "../../core/languages/Language";
import { Pattern } from "../../core/code-patterns/Pattern";
import { Site } from "../../core/sites/Site";
import { Range } from "../../core/documents/Range";
import { CodeVisualisationProvider } from "../../core/visualisations/CodeVisualisationProvider";
import { GenericAstNode } from "../ast/GenericAstNode";
import { Document } from "../../core/documents/Document";
import { GenericAst } from "../ast/GenericAst";
import { CodeRange } from "../utilities/CodeRange";
import { Ast } from "../ast/Ast";

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
              key={language.key}
              label={language.key}
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
      // visualisations: CodeVisualisation[];
    }) => {
      const { providers } = props;

      return <ul style={{
        // margin: "0 1em",
        padding: 0,
        listStyleType: "none"
      }}>
        {providers.map(provider => (
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
                    {visualisation.userInterface.createView()}
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
            gridTemplateColumns: "4fr 3fr 3fr",
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
              <CodeEditor
                language={context.codeEditorLanguage}
                initialContent={context.document.content}
                onContentChange={newContent => context.updateDocumentContent(newContent)}
                onSelectionChange={() => context.updateCodeEditorRanges({ selected: [] })}
                rangesToHighlight={[
                  ...createRangesToHighlightForCodeVisualisations(context.codeVisualisations),
                  ...createRangesToHighlightFromGlobalCodeEditorRanges(context.codeEditorRanges)
                ]}
              />
            </div>
            <div style={{ overflowY: "auto" }}>
              <h3>AST</h3>
              <Ast
                document={context.document}
                eventHandlers={{
                  onMouseEnterNode: (node) => { context.updateCodeEditorRanges({ hovered: [node.range] }); },
                  onMouseLeaveNode: (node) => { context.updateCodeEditorRanges({ hovered: [] }); }
                }}
              />
            </div>
            <div>
              <h3>Visualisations ({context.codeVisualisations.length}):</h3>
              <CodeVisualisationDetails providers={context.codeVisualisationProviders} />
            </div>
          </div>
        </TabPanel>
      )}</GlobalContext.Consumer>
    );
  }
};
