import { Collapse, EditableText } from "@blueprintjs/core";
import React from "react";
import { GlobalContext } from "../../../context";
import { SiteProvider } from "../../../core/sites/SiteProvider";
import { RangeSiteProvider } from "../../../core/sites/textual/RangeSiteProvider";
import { RegexSiteProvider } from "../../../core/sites/textual/RegexSiteProvider";
import RangeSiteProviderDetails from "./RangeSiteProviderDetails";
import RegexSiteProviderDetails from "./RegexSiteProviderDetails";

type Props = {
  provider: SiteProvider
};

export default class SiteProviderListElement extends React.Component<Props> {
  state: {
    isCollapsed: boolean;
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      isCollapsed: false
    }
  }

  private getSiteProviderComponent(provider: SiteProvider) {
    return (
      provider instanceof RangeSiteProvider ? <RangeSiteProviderDetails provider={provider} /> :
      provider instanceof RegexSiteProvider ? <RegexSiteProviderDetails provider={provider} /> :
      <div>Unsupported site provider.</div>
    );
  }

  render() {
    const siteProvider = this.getSiteProviderComponent(this.props.provider);

    return (
      <GlobalContext.Consumer>{context => 
        <div
          className="site-provider-list-element"
        >
          Site ID (must be unique) : <EditableText
            className="site-provider-id"
            value={this.props.provider.id}
            onChange={newId => {
              this.props.provider.id = newId;
              context.declareCodeVisualisationMutation();
            }}
          />
          {siteProvider}
        </div>
      }</GlobalContext.Consumer>
    );
  }
};
  