import React, { ReactElement } from "react";
import "./main-code-editor.css";
import { GlobalContext } from "../../context";
import { CodeEditor, getCursorPositionInEditor } from "../utilities/code-editor/CodeEditor";
import { createRangesToHighlightForMonocles, createRangesToHighlightFromGlobalCodeEditorRanges } from "../utilities/code-editor/RangeToHighlight";
import { Monocle } from "../../core/visualisations/Monocle";

export type Props = {

};

export class MainCodeEditor extends React.PureComponent<Props> {
    private codeEditorRef: React.RefObject<CodeEditor>;
    private monocleContainerRef: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);

        this.codeEditorRef = React.createRef();
        this.monocleContainerRef = React.createRef();
    }

    private renderEmbeddedMonocles(monocles: Monocle[]): ReactElement {
        const renderedMonocles = monocles.map(
            monocle => <monocle.renderer
                monocle={monocle}
                codeEditorRef={this.codeEditorRef}
            />
        );

        return <>
            {renderedMonocles}
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
                        ...createRangesToHighlightForMonocles(context.monocles),
                        ...createRangesToHighlightFromGlobalCodeEditorRanges(context.codeEditorRanges)
                    ]}
                    ref={this.codeEditorRef}
                />
                <div
                    className="monocles"
                    ref={this.monocleContainerRef}
                >
                    {this.renderEmbeddedMonocles(context.monocles)}
                </div>
            </div>
        )}</GlobalContext.Consumer>
    }
}