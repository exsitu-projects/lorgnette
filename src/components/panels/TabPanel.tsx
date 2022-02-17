import React from "react";
import "./panels.css";

export default class TabPanel extends React.PureComponent {
    render() {
        return (
          <div className="TabPanel">
            {this.props.children}
          </div>
        );
    }
  };
  