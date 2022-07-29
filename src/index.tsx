import React from "react";
import ReactDOM from "react-dom";
import { PlaygroundApp } from "./apps/playground/PlaygroundApp";
import "./index.css";

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    <React.StrictMode>
      <PlaygroundApp />
    </React.StrictMode>,
    document.getElementById("root")
  );
});
