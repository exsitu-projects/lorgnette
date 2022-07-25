import React, { ReactElement } from "react";
import "./playground.css";
import { GlobalContext, GlobalContextContent } from "../../context";
import { MonacoEditor } from "../monaco-code-editor/MonacoEditor";
import { Monocle } from "../../core/monocles/Monocle";
import { DecoratedRange } from "../code-editor/DecoratedRange";
import { Range } from "../../core/documents/Range";
import { Position } from "../../core/documents/Position";

export type Props = {

};

export class PlaygroundEditor extends React.PureComponent<Props> {
    private codeEditorRef: React.RefObject<MonacoEditor>;
    private monocleContainerRef: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);

        this.codeEditorRef = React.createRef();
        this.monocleContainerRef = React.createRef();
    }

    private renderEmbeddedMonocles(context: GlobalContextContent): ReactElement {
        const renderedMonocles = context.monocles.map(
            monocle => <monocle.renderer
                key={monocle.uid}
                monocle={monocle}
                codeEditorRef={this.codeEditorRef}
                codeEditorVisibleRange={context.codeEditorRanges.visible}
                codeEditorCursorPosition={context.codeEditorCursorPosition}
            />
        );

        return <>
            {renderedMonocles}
        </>;
    }

    private createDecoratedRanges(monocles: Monocle[], hoveredRanges: Range[], cursorPosition: Position): DecoratedRange[] {
        const decoratedRanges: DecoratedRange[] = [];
        
        // Create one decorated range per monocle.
        for (let monocle of monocles) {
            const cursorIsInsideMonocleRange = monocle.range.contains(cursorPosition);
            decoratedRanges.push(DecoratedRange.fromMonocle(monocle, cursorIsInsideMonocleRange));
        }

        // Create a decorated range per hovered range.
        for (let range of hoveredRanges) {
            decoratedRanges.push(DecoratedRange.fromHighlightedRange(range));
        }

        return decoratedRanges;
    }

    render() {
        return <GlobalContext.Consumer>{ context => (
            <div className="playground-editor-wrapper">
                <MonacoEditor
                    document={context.document}
                    // language={context.document.language}
                    content={context.document.content}
                    // selections={context.codeEditorRanges.selected}
                    decorations={this.createDecoratedRanges(
                        context.monocles,
                        context.codeEditorRanges.hovered,
                        context.codeEditorCursorPosition
                    )}
                    ref={this.codeEditorRef}

                    onContentChange={newContent => context.updateDocumentContent(newContent)}
                    onCursorPositionChange={newPosition =>
                        context.updateCodeEditorCursorPosition(newPosition)
                    }
                    onSelectionChange={newSelection =>
                        context.updateCodeEditorRanges({ selected: [newSelection] })
                    }
                    onScrollChange={newVisibleRange =>
                        context.updateCodeEditorRanges({ visible: newVisibleRange })
                    }
                    onLayoutChange={() => { /* TODO: update the monocle renderers */}}
                />
                <div
                    className="monocles"
                    ref={this.monocleContainerRef}
                >
                    {this.renderEmbeddedMonocles(context)}
                </div>
            </div>
        )}</GlobalContext.Consumer>
    }
}