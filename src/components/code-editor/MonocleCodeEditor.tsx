import React, { ReactElement } from "react";
import "./monocle-code-editor.css";
import { GlobalContext } from "../../context";
import { CodeVisualisation } from "../../core/visualisations/CodeVisualisation";
import { CodeEditor } from "./CodeEditor";
import { createRangesToHighlightForCodeVisualisations, createRangesToHighlightFromGlobalCodeEditorRanges } from "./RangeToHighlight";

export type Props = {

};

type State = {

};

export class MonocleCodeEditor extends React.Component<Props, State> {
    private codeEditorRef: React.RefObject<CodeEditor>;
    private codeVisualisationContainerRef: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);

        this.codeEditorRef = React.createRef();
        this.codeVisualisationContainerRef = React.createRef();

        this.state = {};
    }

    private renderLocalCodeVisualisations(codeVisualisations: CodeVisualisation[]): ReactElement {
        const localCodeVisualisations = codeVisualisations.filter(visualisation => true); // TODO: update this

        const renderedLocalCodeVisualisations = localCodeVisualisations.map(
            visualisation => <visualisation.renderer
                codeVisualisation={visualisation}
                codeEditorRef={this.codeEditorRef}
            />
        );

        return <>
            {renderedLocalCodeVisualisations}
        </>;
    }

    render() {
        return <GlobalContext.Consumer>{ context => (
            <div className="monocle-code-editor-wrapper">
                <CodeEditor
                    language={context.document.language}
                    initialContent={context.document.content}
                    onContentChange={newContent => context.updateDocumentContent(newContent)}
                    onSelectionChange={() => context.updateCodeEditorRanges({ selected: [] })}
                    rangesToHighlight={[
                        ...createRangesToHighlightForCodeVisualisations(context.codeVisualisations),
                        ...createRangesToHighlightFromGlobalCodeEditorRanges(context.codeEditorRanges)
                    ]}
                    ref={this.codeEditorRef}
                />
                <div
                    className="code-visualisations"
                    ref={this.codeVisualisationContainerRef}
                >
                    {this.renderLocalCodeVisualisations(context.codeVisualisations)}
                </div>
            </div>
        )}</GlobalContext.Consumer>
    }
}