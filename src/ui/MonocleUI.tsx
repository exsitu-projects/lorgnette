import React from "react";
import "./monocle-ui.css";
import { Tab, Tabs } from "@blueprintjs/core";
import { Playground } from "./playground/Playground";

export class MonocleUI extends React.PureComponent {
    render() {
        return <Tabs
            className="monocle-ui-main-tabs"
            large={true}
          >
            <Tab
              className="monocle-ui-main-tab"
              title="Code editor"
              panel={<Playground/>}
            />
          </Tabs>
    }
}