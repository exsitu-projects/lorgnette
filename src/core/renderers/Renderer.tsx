import React, { ReactElement } from "react";
import { CodeVisualisation } from "../visualisations/CodeVisualisation";
import { CodeEditor } from "../../ui/utilities/code-editor/CodeEditor";

export interface RendererProps {
    codeVisualisation: CodeVisualisation;
    codeEditorRef: React.RefObject<CodeEditor>;
};

export interface RendererState {};

export abstract class Renderer<
    P extends RendererProps = RendererProps,
    S extends RendererState = RendererState
> extends React.Component<P, S> {
    abstract get name(): string;
    abstract render(): ReactElement;
}