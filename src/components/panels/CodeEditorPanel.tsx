import React from "react";
import TabPanel from "./TabPanel";
import { Select } from "@blueprintjs/select";
import CodeEditor, { createCodeRangesToHighlightForCodeVisualisations } from "../code-editor/CodeEditor";
import { Button } from "@blueprintjs/core";
import { GlobalContext } from "../../context";
import { Language, SUPPORTED_LANGUAGES } from "../../core/Language";
import { Pattern } from "../../core/code-patterns/Pattern";
import { Site } from "../../core/sites/Site";
import { Range } from "../../core/documents/Range";
import { CodeVisualisationProvider } from "../../core/visualisations/CodeVisualisationProvider";

export const LanguageSelect = Select.ofType<Language>();

export default class CodeEditorPanel extends React.PureComponent {
  render() {
    type OnLanguageChange = (newLanguage: Language) => void;
    const LanguageSelector = (props: { onLanguageChange: OnLanguageChange }) => <LanguageSelect
      items={[...SUPPORTED_LANGUAGES]}
      itemRenderer={language => (<span className="select-item">{language.name}</span>)}
      onItemSelect={item => props.onLanguageChange(item)}
    >
      <Button text={SUPPORTED_LANGUAGES[0].name} rightIcon="double-caret-vertical" />
    </LanguageSelect>
    
    const CodeRangeCoords = (props: {range: Range}) => {
      const start = props.range.start;
      const end = props.range.end;

      return (
        <p className="code-range">
          {start.row};{start.column}–{end.row};{end.column
        }</p>
      );
    }

    const AbsoluteSiteRangeCoords = (props: {pattern: Pattern, site: Site}) => {
      const absoluteSiteCodeRange = props.site.range.relativeTo(props.pattern.range.start);
      return <CodeRangeCoords range={absoluteSiteCodeRange} />
    }

    const CodeVisualisationDetails = (props: {
      providers: CodeVisualisationProvider[];
      // visualisations: CodeVisualisation[];
    }) => {
      const { providers } = props;
      return <ul>
        {providers.map(provider => (
          <li>
            <h5>{provider.name} ({provider.codeVisualisations.length} match(es))</h5>
            <ul>
              {
                provider.codeVisualisations.map(visualisation => (
                  <li>
                    {/* Range of the visualisation */}
                    <CodeRangeCoords range={visualisation.range} />

                    {/* Details about each site */}
                    <strong>Sites:</strong>
                    <ul>
                      {visualisation.sites.map(site => (
                        <AbsoluteSiteRangeCoords
                          pattern={visualisation.pattern}
                          site={site}
                        />
                      ))}
                    </ul>

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
            gridTemplateColumns: "50% 50%",
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
                <LanguageSelector onLanguageChange={context.updateCodeEditorLanguage}/>
              </div>
              <CodeEditor
                language={context.codeEditorLanguage.key}
                initialContent={context.document.content}
                onContentChange={context.updateDocumentContent}
                rangesToHighlight={
                  createCodeRangesToHighlightForCodeVisualisations(context.codeVisualisations)
                }
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
