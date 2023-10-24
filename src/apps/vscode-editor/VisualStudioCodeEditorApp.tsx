import "../global-style.css";
import "./visual-studio-code-editor-app.css";

import React from "react";
import { PlaygroundEditor } from "../playground/PlaygroundEditor";
import { VscodeLorgnetteEnvironment } from "./VscodeLorgnetteEnvironment";

export class VisualStudioCodeEditorApp extends React.PureComponent {
    render() {
        return <section id="lorgnette-editor-app">
            <VscodeLorgnetteEnvironment>
                <PlaygroundEditor />
            </VscodeLorgnetteEnvironment>
        </section>;
    }
}