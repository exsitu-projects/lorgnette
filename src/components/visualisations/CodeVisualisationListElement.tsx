import React from "react";
import "./CodeVisualisations.css";
import { EditableText } from "@blueprintjs/core";
import { GlobalContext } from "../../context";
import { CodeVisualisationProvider } from "../../core/visualisations/CodeVisualisationProvider";

type Props = {
  visualisation: CodeVisualisationProvider
};

export default class CodeVisualisationListElement extends React.PureComponent<Props> {
    render() {
      return (
        <GlobalContext.Consumer>{context => 
          <div
            className="code-visualisation-list-element"
          >
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
        }</GlobalContext.Consumer>
      );
    }
  };
  