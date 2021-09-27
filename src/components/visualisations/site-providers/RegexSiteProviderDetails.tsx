import React from "react";
import { GlobalContext } from "../../../context";
import { RegexSiteProvider } from "../../../core/sites/textual/RegexSiteProvider";
import { RegexPatternEditor } from "../../utilities/RegexPatternEditor";

type Props = {
  provider: RegexSiteProvider
};

export default class RegexSiteProviderDetails extends React.Component<Props> {
    render() {
      return (
        <GlobalContext.Consumer>{context => 
          <div
            className="site-provider-details textual regex"
          >
            <RegexPatternEditor
              label="Regex of the site:"
              regexMatcher={this.props.provider.regexMatcher}
            />
          </div>
        }</GlobalContext.Consumer>
      );
    }
  };
  