import React from "react";
import "./CodeFragmentSiteThumbnail.css";
import { CodeFragmentSiteType } from "./CodeFragmentSite";
import { EditableText } from "@blueprintjs/core";

export default class CodeFragmentSiteThumbnail extends React.Component {
    state: {
      name: string;
      type: CodeFragmentSiteType;
    };
  
    constructor(props: any) {
      super(props);
  
      this.state = {
        name: "Test site",
        type: CodeFragmentSiteType.Function,
      };
    }

    private onNameChange(newName: string): void {
      this.setState({
        name: newName
      });
    }
  
    render() {
      return (
        <div
          className="code-fragment-site-thumbnail"
        >
          <EditableText
            className="code-fragment-site-name"
            value={this.state.name}
            onChange={this.onNameChange.bind(this)}
          />
          <div
            className="code-fragment-site-type"
          >
            {this.state.type}
          </div>
        </div>
      );
    }
  };
  