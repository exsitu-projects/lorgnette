import React, { ReactElement } from "react";
import { CodeVisualisation } from "../visualisations/CodeVisualisation";
import { CodeEditor } from "../../components/code-editor/CodeEditor";

export interface RendererProps {
    codeVisualisation: CodeVisualisation;
    codeEditorRef: React.RefObject<CodeEditor>;
};

export abstract class Renderer<P extends RendererProps = RendererProps> extends React.Component<P> {
    abstract get name(): string;
    abstract render(): ReactElement;
}