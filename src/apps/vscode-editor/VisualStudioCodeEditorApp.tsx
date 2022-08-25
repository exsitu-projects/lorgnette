import React from "react";
import { PlaygroundEditor } from "../../ui/playground/PlaygroudEditor";
import "./visual-studio-code-editor-app.css";
import { VisualStudioCodeEditorMonocleEnvironmentProvider } from "./VisualStudioCodeEditorMonocleEnvironmentProvider";

export class VisualStudioCodeEditorApp extends React.PureComponent {
    render() {
        return <section id="monocle-editor-app">
            <VisualStudioCodeEditorMonocleEnvironmentProvider>
                <PlaygroundEditor />
            </VisualStudioCodeEditorMonocleEnvironmentProvider>
        </section>;
    }
}