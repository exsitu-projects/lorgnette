import "../global-style.css";
import "./playground.css";

import React from "react";
import { createRoot } from 'react-dom/client';
import { Playground } from "./Playground";
import { PlaygroundLorgnetteEnvironment } from "./PlaygroundLorgnetteEnvironment";

document.addEventListener("DOMContentLoaded", () => {
    const rootElement = document.getElementById("lorgnette-playground-app");
    const root = createRoot(rootElement!);

    root.render(
        <React.StrictMode>
            <PlaygroundLorgnetteEnvironment useLocalStore={true}>
                <Playground />
            </PlaygroundLorgnetteEnvironment>
        </React.StrictMode>
    );
});
    