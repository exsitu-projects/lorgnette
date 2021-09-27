import { Button } from "@blueprintjs/core";
import React from "react";

type Props = {
  text: string;
  onClick: () => void;
}

export default class AddListEntryElement extends React.Component<Props> {
    state: {};
  
    constructor(props: any) {
      super(props);
  
      this.state = {};
    }
  
    render() {
      return (
        <div
            className="list-add-entry-element"
        >
            <Button
              text={this.props.text}
              onClick={this.props.onClick}
            />
        </div>
      );
    }
  };
  