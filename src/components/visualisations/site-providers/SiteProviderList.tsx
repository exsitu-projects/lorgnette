import React from "react";
import { SiteProvider } from "../../../core/sites/SiteProvider";
import { CodeVisualisationProvider } from "../../../core/visualisations/CodeVisualisationProvider";
import { CodeVisualisationType } from "../../../core/visualisations/CodeVisualisationType";
import { TextualCodeVisualisationProvider } from "../../../core/visualisations/textual/TextualCodeVisualisationProvider";
import List from "../../utilities/list/List";
import SiteProviderListElement from "./SiteProviderListElement";


type Props = {
  visualisation: CodeVisualisationProvider
};

export default class SiteProviderList extends React.PureComponent<Props> {

  private renderSiteProviders<T extends CodeVisualisationType>(siteProviders: SiteProvider<T>[]): JSX.Element {
    return (
      <div
        className="site-providers-list"
      >
        <List
          values={siteProviders}
          valueRenderer={provider => <SiteProviderListElement provider={provider} />}
        />
      </div>
    );
  }

  // A (useless) case distinction seems to be required for the List component
  // to accept a list of site providers that are all textual or syntactic.
  render() {
    const visualisation = this.props.visualisation;

    // Site providers for a textual visualisation
    if (visualisation instanceof TextualCodeVisualisationProvider) {
      const siteProviders = visualisation.siteProviders;
      return this.renderSiteProviders(siteProviders);
    }
    // Site providers for a syntactic visualisation
    else {
      const siteProviders = visualisation.siteProviders;
      return this.renderSiteProviders(siteProviders);
    }
  }
};
