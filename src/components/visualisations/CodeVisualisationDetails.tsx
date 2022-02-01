import React from "react";
import "./CodeVisualisations.css";
import { EditableText } from "@blueprintjs/core";
import { GlobalContext } from "../../context";
import RegexPatternFinderDetails from "./pattern-finders/RegexPatternFinderDetails";
import SyntacticPatternFinderDetails from "./pattern-finders/SyntacticPatternFinderDetails";
import SiteProviderList from "./site-providers/SiteProviderList";
import { SyntacticPatternFinder } from "../../core/code-patterns/syntactic/SyntacticPatternFinder";
import { RegexPatternFinder } from "../../core/code-patterns/textual/RegexPatternFinder";
import { CodeVisualisationProvider } from "../../core/visualisations/CodeVisualisationProvider";

type Props = {
  visualisation: CodeVisualisationProvider
};

export default class CodeVisualisationDetails extends React.Component<Props> {
    render() {
      return (
        <GlobalContext.Consumer>{context => 
          <div
            className="code-visualisation-details"
          >
            <div style={{
                textAlign: "center"
            }}>
                <EditableText
                className="name"
                value={this.props.visualisation.name}
                onChange={newName => {
                    this.props.visualisation.name = newName;
                    context.declareCodeVisualisationMutation();
                }}
                />
                <div
                className="type"
                >
                {this.props.visualisation.type}
                </div>
            </div>

            {
                // Pattern finder
                // TODO: ew change that!
                this.props.visualisation.patternFinder instanceof RegexPatternFinder
                    ? <RegexPatternFinderDetails patternFinder={this.props.visualisation.patternFinder} />
                : this.props.visualisation.patternFinder instanceof SyntacticPatternFinder
                    ? <SyntacticPatternFinderDetails patternFinder={this.props.visualisation.patternFinder} />
                : <p>Unsupported pattern finder type.</p>
            }

            {
              // Site providers
              <SiteProviderList visualisation={this.props.visualisation} />
            }
          </div>
        }</GlobalContext.Consumer>
      );
    }
  };
  