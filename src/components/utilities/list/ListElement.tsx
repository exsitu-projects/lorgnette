import React from "react";

type Props = {
  onClick: () => void;
};

export default class ListElement extends React.PureComponent<Props> {  
    render() {
      return (
        <div
            className="list-element"
            onClick={this.props.onClick}
        >
            {this.props.children}
        </div>
      );
    }
  };
  