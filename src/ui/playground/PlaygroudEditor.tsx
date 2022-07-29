import React, { ReactElement } from "react";
import "./playground.css";
import { MonacoEditor } from "../monaco-code-editor/MonacoEditor";
import { Monocle } from "../../core/monocles/Monocle";
import { DecoratedRange } from "../code-editor/DecoratedRange";
import { Range } from "../../core/documents/Range";
import { Position } from "../../core/documents/Position";
import { MonocleEnvironment, MonocleEnvironmentContext } from "../../MonocleEnvironment";

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

    private renderEmbeddedMonocles(environment: MonocleEnvironment): ReactElement {
        const renderedMonocles = environment.monocles.map(
            monocle => <monocle.renderer
                key={monocle.uid}
                monocle={monocle}
                codeEditorRef={this.codeEditorRef}
                codeEditorVisibleRange={environment.codeEditorRanges.visible}
                codeEditorCursorPosition={environment.codeEditorCursorPosition}
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
        return <MonocleEnvironmentContext.Consumer>{ environment => (
            <div className="playground-editor-wrapper">
                <MonacoEditor
                    document={environment.document}
                    // language={environment.document.language}
                    content={environment.document.content}
                    // selections={environment.codeEditorRanges.selected}
                    decorations={this.createDecoratedRanges(
                        environment.monocles,
                        environment.codeEditorRanges.hovered,
                        environment.codeEditorCursorPosition
                    )}
                    ref={this.codeEditorRef}

                    onContentChange={newContent => environment.updateDocumentContent(newContent)}
                    onCursorPositionChange={newPosition =>
                        environment.updateCodeEditorCursorPosition(newPosition)
                    }
                    onSelectionChange={newSelection =>
                        environment.updateCodeEditorRanges({ selected: [newSelection] })
                    }
                    onScrollChange={newVisibleRange =>
                        environment.updateCodeEditorRanges({ visible: newVisibleRange })
                    }
                    onLayoutChange={() => { /* TODO: update the monocle renderers */}}
                />
                <div
                    className="monocles"
                    ref={this.monocleContainerRef}
                >
                    {this.renderEmbeddedMonocles(environment)}
                </div>
            </div>
        )}</MonocleEnvironmentContext.Consumer>
    }
}