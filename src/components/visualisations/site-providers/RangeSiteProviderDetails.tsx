import React from "react";
import { NumericInput } from "@blueprintjs/core";
import { GlobalContext } from "../../../context";
import { RangeSiteProvider } from "../../../core/sites/textual/RangeSiteProvider";

type Props = {
    provider: RangeSiteProvider
  };

export default class RangeSiteProviderDetails extends React.Component<Props> {
    render() {
      const startIndexAsString = (this.props.provider.startIndex ?? "").toString();
      const endIndexAsString = (this.props.provider.endIndex ?? "").toString();

      return (
        <GlobalContext.Consumer>{context => 
          <div
            className="site-provider-details textual range"
          >
            Start index:
            <NumericInput
              value={startIndexAsString}
              onValueChange={newStartIndex => {
                this.props.provider.startIndex = newStartIndex;
                context.declareCodeVisualisationMutation();
              }}
              allowNumericCharactersOnly={true}
              min={0}
              minorStepSize={1}
              majorStepSize={10}
            />

            End index:
            <NumericInput
              value={endIndexAsString}
              onValueChange={newEndIndex => {
                this.props.provider.endIndex = newEndIndex;
                context.declareCodeVisualisationMutation();
              }}
              allowNumericCharactersOnly={true}
              min={this.props.provider.startIndex ?? 0}
              minorStepSize={1}
              majorStepSize={10}
            />
          </div>
        }</GlobalContext.Consumer>
      );
    }
  };
  