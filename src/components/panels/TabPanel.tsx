import React from "react";
import "./TabPanel.css";

export default class TabPanel extends React.PureComponent {
    render() {
        return (
          <div className="TabPanel">
            {this.props.children}
          </div>
        );
    }
  };
  