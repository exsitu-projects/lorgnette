import React from "react";
import { GlobalContext } from "../../../context";
import { SyntacticPatternFinder } from "../../../core/code-patterns/syntactic/SyntacticPatternFinder";

type Props = {
  patternFinder: SyntacticPatternFinder
};

export default class SyntacticPatternFinderDetails extends React.PureComponent<Props> {
    render() {
      return (
        <GlobalContext.Consumer>{context => 
          <div
            className="pattern-finder-details syntactic"
          >
            TODO
          </div>
        }</GlobalContext.Consumer>
      );
    }
  };
  