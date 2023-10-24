import "../global-style.css";
import "./playground.css";

import React from "react";
import ReactDOM from "react-dom";
import { LorgnetteEnvironment } from "../../core/lorgnette/LorgnetteEnvironment";
import { Playground } from "./Playground";
import { PlaygroundLorgnetteEnvironment } from "./PlaygroundLorgnetteEnvironment";

document.addEventListener("DOMContentLoaded", () => {
    ReactDOM.render(
        <React.StrictMode>
            <PlaygroundLorgnetteEnvironment>
                <Playground />
            </PlaygroundLorgnetteEnvironment>
        </React.StrictMode>,
        document.getElementById("lorgnette-playground-app")
    );
});
    