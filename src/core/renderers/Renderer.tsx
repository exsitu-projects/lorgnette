import React, { ReactElement } from "react";
import { CodeEditor } from "../code-editor/CodeEditor";
import { Position } from "../documents/Position";
import { Range } from "../documents/Range";
import { Projection } from "../projections/Projection";

export interface RendererProps {
    projection: Projection;
    codeEditorRef: React.RefObject<CodeEditor>;
    codeEditorVisibleRange: Range;
    codeEditorCursorPosition: Position;
};

export interface RendererState {};

export abstract class Renderer<
    P extends RendererProps = RendererProps,
    S extends RendererState = RendererState
> extends React.Component<P, S> {
    abstract get className(): string;
    protected rendererWrapperRef: React.RefObject<HTMLDivElement>;

    constructor(props: P) {
        super(props);
        this.rendererWrapperRef = React.createRef();
    }

    abstract renderProjection(): ReactElement;

    // A projection is said to be "active" if its user interface is fully displayed by the renderer.
    abstract get isActive(): boolean;

    // By default, a renderer only renders a projection if
    // – it is active (and therefore already rendered); or
    // – the range of the projection intersects with the visible range of the editor.
    // This method can be overriden by concrete renderers to modify this behaviour.
    protected get isVisible(): boolean {
        return this.isActive
            || this.props.codeEditorVisibleRange.intersects(this.props.projection.range);
    }

    // Helper function to work with the bounding boxes of the code editor and the fragment of the projection
    // without having to assert whether they are available or not or to retry if they are not ready yet.
    protected useBoundingBoxesAfterRedraw(
        action: ({ codeEditorBox, projectionFragmentBox}: {
            codeEditorBox: DOMRect,
            projectionFragmentBox: DOMRect
        }) => void,
        retryOnFailure: boolean = true
    ): void {
        // Wait for the next redraw of the webpage before getting the bounding boxes.
        // This is required to ensure that the code editor and the decorations used to locate the fragment
        // are part of the DOM and positioned correctly, which is mandatory for positioning relatively to them.
        window.requestAnimationFrame(() => {
            const codeEditor = this.props.codeEditorRef.current;
            if (!codeEditor) {
                console.warn("Bounding boxes cannot be retrieved: the code editor is not available.", codeEditor);
                return;
            }

            // Get the bounding box of the code editor.
            const codeEditorBoundingBox = codeEditor.getEditorBoundingBox();

            // Compute the bounding box of the fragment of a projection
            // using the bounding boxes of the decorations with the projection's ID.
            // In case of failure (the DOM may not have been updated yet), possibly retry.
            const id = this.props.projection.uid;
            try {
                const projectionFragmentBoundingBox = codeEditor.getDecorationBoundingBoxWithId(id);
                action({
                    codeEditorBox: codeEditorBoundingBox,
                    projectionFragmentBox: projectionFragmentBoundingBox
                });
            }
            catch (exception) {
                if (retryOnFailure) {
                    this.useBoundingBoxesAfterRedraw(action, retryOnFailure);
                }
            }
        });        
    }

    render() {
        if (!this.isVisible) {
            return null;
        }

        return <div
                className={`projection-renderer ${this.className} ${this.isActive ? "active" : ""}`}
                ref={this.rendererWrapperRef}
            >
                { this.renderProjection() }
            </div>;
    }
}