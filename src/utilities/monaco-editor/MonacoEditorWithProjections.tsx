import "./monaco-editor-with-projections.css";
import React, { ReactElement } from "react";
import { MonacoEditor } from "./MonacoEditor";
import { Projection } from "../../core/projections/Projection";
import { DecoratedRange } from "../../core/code-editor/DecoratedRange";
import { Range } from "../../core/documents/Range";
import { Position } from "../../core/documents/Position";
import { LorgnetteContext } from "../../core/lorgnette/LorgnetteContext";
import { LorgnetteEnvironmentState } from "../../core/lorgnette/LorgnetteEnvironment";

export type Props = {

};

export class MonacoEditorWithProjections extends React.PureComponent<Props> {
    private codeEditorRef: React.RefObject<MonacoEditor>;
    private projectionContainerRef: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);

        this.codeEditorRef = React.createRef();
        this.projectionContainerRef = React.createRef();
    }

    private renderProjections(environment: LorgnetteEnvironmentState): ReactElement {
        return <>{
            environment.projections.map(
                projection => <projection.renderer
                    key={projection.uid}
                    projection={projection}
                    codeEditorRef={this.codeEditorRef}
                    codeEditorVisibleRange={environment.codeEditorVisibleRange}
                    codeEditorCursorPosition={environment.codeEditorCursorPosition}
                />
            )
        }</>;
    }

    private createDecoratedRanges(projections: Projection[], hoveredRanges: Range[], cursorPosition: Position): DecoratedRange[] {
        const decoratedRanges: DecoratedRange[] = [];
        
        // Create one decorated range per projection.
        for (let projection of projections) {
            const cursorIsInsideProjectionRange = projection.range.contains(cursorPosition);
            decoratedRanges.push(DecoratedRange.fromProjection(projection, cursorIsInsideProjectionRange));
        }

        // Create a decorated range per hovered range.
        for (let range of hoveredRanges) {
            decoratedRanges.push(DecoratedRange.fromHighlightedRange(range));
        }

        return decoratedRanges;
    }

    render() {
        return <LorgnetteContext.Consumer>{ environment => (
            <div className="monaco-editor-with-projections">
                <MonacoEditor
                    document={environment.document}
                    content={environment.document.content}
                    decorations={this.createDecoratedRanges(
                        environment.projections,
                        environment.codeEditorHoveredRanges,
                        environment.codeEditorCursorPosition
                    )}
                    onContentChange={newContent =>
                        environment.setDocumentContent(newContent)
                    }
                    onCursorPositionChange={newPosition =>
                        environment.setCodeEditorCursorPosition(newPosition)
                    }
                    onSelectionChange={newSelection =>
                        environment.setCodeEditorSelectedRanges([newSelection])
                    }
                    onScrollChange={newVisibleRange =>
                        environment.setCodeEditorVisibleRange(newVisibleRange)
                    }
                    onLayoutChange={() => { /* TODO: update the projection renderers */}}
                    ref={this.codeEditorRef}
                />
                <div
                    className="projections"
                    ref={this.projectionContainerRef}
                >
                    {this.renderProjections(environment)}
                </div>
            </div>
        )}</LorgnetteContext.Consumer>
    }
}
