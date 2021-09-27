import React from "react";
import { GlobalContext } from "../../../context";
import { RegexPatternFinder } from "../../../core/code-patterns/textual/RegexPatternFinder";

type Props = {
  patternFinder: RegexPatternFinder
};

export default class RegexPatternFinderDetails extends React.Component<Props> {
    render() {
      return (
        <GlobalContext.Consumer>{context => 
          <div
            className="pattern-finder-details regex"
          >
            
          </div>
        }</GlobalContext.Consumer>
      );
    }
  };
  