import "../global-style.css";
import "./vscode-editor-app.css";

import React from "react";
import { createRoot } from "react-dom/client";
import { MonacoEditorWithProjections } from "../../utilities/monaco-editor/MonacoEditorWithProjections";
import { VscodeLorgnetteEnvironment } from "./VscodeLorgnetteEnvironment";

document.addEventListener("DOMContentLoaded", () => {
    const rootElement = document.getElementById("lorgnette-vscode-editor-app");
    const root = createRoot(rootElement!);

    root.render(
        <React.StrictMode>
            <VscodeLorgnetteEnvironment>
                <MonacoEditorWithProjections />
            </VscodeLorgnetteEnvironment>
        </React.StrictMode>
    );
});
