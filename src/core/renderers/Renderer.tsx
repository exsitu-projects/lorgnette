import React, { ReactElement } from "react";
import { CodeEditor } from "../../ui/utilities/code-editor/CodeEditor";
import { Monocle } from "../monocles/Monocle";

export interface RendererProps {
    monocle: Monocle;
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