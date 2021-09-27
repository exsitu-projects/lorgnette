import React from "react";
import AddListEntryElement from "./AddListEntryElement";
import "./List.css";
import ListElement from "./ListElement";

type Props<T> = {
  values: T[];
  valueRenderer: (value: T, index: number) => JSX.Element;
  onEntrySelected?: (value: T) => void;
} & ({
    showAddEntryButton?: false;
  } | {
    showAddEntryButton: true;
    addEntryButtonText: string;
    onAddEntryButtonClick: () => void;
  });

export default class List<T> extends React.Component<Props<T>> {
    state: {};
  
    constructor(props: any) {
      super(props);
  
      this.state = {};
    }
  
    render() {
      const onClick = this.props.onEntrySelected ?? (() => {});

      // Fragment representing the content of the list.
      // Empty if the component has no child.
      const listElements: JSX.Element[] = [];
      for (let i = 0; i < this.props.values.length; i++) {
        listElements.push(
        <ListElement
          onClick={() => onClick(this.props.values[i])}
        >
          {this.props.valueRenderer(this.props.values[i], i)}
        </ListElement>);
      }

      let addEntryButton = null;
      if (this.props.showAddEntryButton) {
        addEntryButton = (
          <AddListEntryElement
            text={this.props.addEntryButtonText}
            onClick={this.props.onAddEntryButtonClick}
          />
        );
      }
      
      return (
        <div
          className="list"
        >
          {listElements}
          {addEntryButton}
        </div>
      );
    }
  };
  