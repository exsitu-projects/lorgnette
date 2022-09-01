import React from "react";
import ReactDOM from "react-dom";
import { PlaygroundApp } from "./apps/playground/PlaygroundApp";
// import { VisualStudioCodeEditorApp } from "./apps/vscode-editor/VisualStudioCodeEditorApp";
import "./index.css";

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    <React.StrictMode>
      {/* <VisualStudioCodeEditorApp /> */}
      <PlaygroundApp />
    </React.StrictMode>,
    document.getElementById("root")
  );
});
