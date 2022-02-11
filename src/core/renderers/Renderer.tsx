import React, { ReactElement } from "react";
import { Button } from "@blueprintjs/core";
import { CodeVisualisation } from "../visualisations/CodeVisualisation";
import { CodeEditor } from "../../components/code-editor/CodeEditor";

export type Props = {
    codeVisualisation: CodeVisualisation;
    codeEditorRef: React.RefObject<CodeEditor>;
};

export abstract class Renderer extends React.Component<Props> {
    abstract get name(): string;
    abstract render(): ReactElement;
}