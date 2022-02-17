import React, { ReactElement } from "react";
import "./main-code-editor.css";
import { GlobalContext } from "../../context";
import { CodeVisualisation } from "../../core/visualisations/CodeVisualisation";
import { CodeEditor, getCursorPositionInEditor } from "../utilities/code-editor/CodeEditor";
import { createRangesToHighlightForCodeVisualisations, createRangesToHighlightFromGlobalCodeEditorRanges } from "../utilities/code-editor/RangeToHighlight";

export type Props = {

};

export class MainCodeEditor extends React.PureComponent<Props> {
    private codeEditorRef: React.RefObject<CodeEditor>;
    private codeVisualisationContainerRef: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);

        this.codeEditorRef = React.createRef();
        this.codeVisualisationContainerRef = React.createRef();
    }

    private renderLocalCodeVisualisations(codeVisualisations: CodeVisualisation[]): ReactElement {
        const renderedLocalCodeVisualisations = codeVisualisations.map(
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
            <div className="main-code-editor-wrapper">
                <CodeEditor
                    language={context.document.language}
                    initialContent={context.document.content}
                    onContentChange={newContent => context.updateDocumentContent(newContent)}
                    onCursorChange={aceEditor =>
                        context.updateCodeEditorCursorPosition(getCursorPositionInEditor(aceEditor, context.document))
                    }
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