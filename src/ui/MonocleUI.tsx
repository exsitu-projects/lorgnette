import React from "react";
import "./monocle-ui.css";
import { Tab, Tabs } from "@blueprintjs/core";
import { MainCodeEditorPanel } from "./main-code-editor/MainCodeEditorPanel";

export class MonocleUI extends React.PureComponent {
    render() {
        return <Tabs
            className="monocle-ui-main-tabs"
            large={true}
          >
            <Tab
              className="monocle-ui-main-tab"
              title="Code editor"
              panel={<MainCodeEditorPanel/>}
            />
          </Tabs>
    }
}