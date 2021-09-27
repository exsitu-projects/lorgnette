import React from "react";
import { GlobalContext } from "../../../context";
import { AstPatternFinder } from "../../../core/code-patterns/syntactic/AstPatternFinder";

type Props = {
  patternFinder: AstPatternFinder
};

export default class RegexPatternFinderDetails extends React.PureComponent<Props> {
    render() {
      return (
        <GlobalContext.Consumer>{context => 
          <div
            className="pattern-finder-details ast"
          >
            TODO
          </div>
        }</GlobalContext.Consumer>
      );
    }
  };
  