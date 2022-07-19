import React, { ReactElement } from "react";
import "./playground.css";
import { GlobalContext } from "../../context";
import { CodeEditor, getCursorPositionInEditor } from "../code-editor/CodeEditor";
import { createRangesToHighlightForMonocles, createRangesToHighlightFromGlobalCodeEditorRanges } from "../code-editor/RangeToHighlight";
import { Monocle } from "../../core/monocles/Monocle";

export type Props = {

};

export class PlaygroundEditor extends React.PureComponent<Props> {
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
            <div className="playground-editor-wrapper">
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