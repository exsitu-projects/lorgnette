import "../global-style.css";
import "./visual-studio-code-editor-app.css";

import React from "react";
import { MonacoEditorWithProjections } from "../../utilities/monaco-editor/MonacoEditorWithProjections";
import { VscodeLorgnetteEnvironment } from "./VscodeLorgnetteEnvironment";

export class VisualStudioCodeEditorApp extends React.PureComponent {
    render() {
        return <section id="lorgnette-editor-app">
            <VscodeLorgnetteEnvironment>
                <MonacoEditorWithProjections />
            </VscodeLorgnetteEnvironment>
        </section>;
    }
}