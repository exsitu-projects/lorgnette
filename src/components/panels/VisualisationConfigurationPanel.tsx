import React from "react";
import CodeVisualisationListElement from "../visualisations/CodeVisualisationListElement";
import List from "../utilities/list/List";
import TabPanel from "./TabPanel";
import { GlobalContext } from "../../context";
import { CodeVisualisationProvider } from "../../core/visualisations/CodeVisualisationProvider";
import CodeVisualisationDetails from "../visualisations/CodeVisualisationDetails";

export default class VisualisationProvidersConfigurationPanel extends React.Component {
  state: {
    selectedVisualisationProvider: CodeVisualisationProvider | null;
  };

  constructor(props: any) {
    super(props);

    this.state = {
      selectedVisualisationProvider: null
    };
  }

  private selectVisualisation(visualisation: CodeVisualisationProvider): void {
    this.setState({
      selectedVisualisation: visualisation
    });
  }

  private createNewVisualisation(): void {
    // TODO
  }

  render() {
      return (
        <GlobalContext.Consumer>{ context => (
        <TabPanel>
          <div style={{
            display: "grid",
            gridTemplateRows: "auto",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "1em",
            height: "100%"
          }}>
            <div>
              <List
                values={context.codeVisualisationProviders}
                valueRenderer={value => <CodeVisualisationListElement visualisation={value} />}
                onEntrySelected={this.selectVisualisation.bind(this)}
                showAddEntryButton={true}
                addEntryButtonText="New visualisation"
                onAddEntryButtonClick={this.createNewVisualisation.bind(this)}
              />
            </div>
            <div>
              {
                this.state.selectedVisualisationProvider
                  ? <CodeVisualisationDetails visualisation={this.state.selectedVisualisationProvider} />
                  : <p>Select or create a visualisation to configure it.</p>
              }
            </div>
            <div>
              Choice of the visualisation and mappings with the pattern's sites.
            </div>
          </div>
        </TabPanel>
        ) }</GlobalContext.Consumer>
      );
  }
};
