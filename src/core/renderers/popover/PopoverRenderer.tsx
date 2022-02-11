import React, { ComponentProps, ReactElement } from "react";
import "./popover-renderer.css";
import { Popover2, Popover2Props, Popover2TargetProps } from "@blueprintjs/popover2";
import { Renderer, RendererProps } from "../Renderer";

export abstract class PopoverRenderer extends Renderer {
    protected popoverWrapperRef: React.RefObject<HTMLDivElement>;

    constructor(props: RendererProps) {
        super(props);
        this.popoverWrapperRef = React.createRef();
    }

    protected repositionWrapper(): void {
        // Wait for the next redraw of the webpage before updating the wrapper's position.
        // This is required to ensure that the code editor and the markers are part of the DOM
        // and positioned correctly, which is mandatory for positioning relatively to them.
        window.requestAnimationFrame(() => {
            const wrapperRef = this.popoverWrapperRef.current;
            const codeEditorRef = this.props.codeEditorRef.current;

            if (!wrapperRef || !codeEditorRef) {
                console.warn("Code vis. GUIs cannot be repositioned: required React refs are not available.", wrapperRef, codeEditorRef);
                return;
            }

            // Get the bounding box of the set of markers associated with the code visualisations
            // (i.e., the areas in the code editor that correspond to this visualisation).
            // If the set is empty, possibly because there has been an update and they have not been redrawn yet,
            // simply skip the repositioning instead of drawing them at an arbitrary position scuh as (0, 0).
            const id = this.props.codeVisualisation.id;
            const markerSet = codeEditorRef.getMarkerSetWithId(id);
            if (markerSet.size === 0) {
                return;
            }

            const visualisedCodeBoundingBox = markerSet.boundingBox;

            // Position the wrapper next to the markers' bounding box.
            const top = visualisedCodeBoundingBox.top;
            // const top = visualisedCodeBoundingBox.top - (codeVisualisationBoundingBox.height / 2);
            const left = visualisedCodeBoundingBox.right + 20;

            wrapperRef.style.top = `${top}px`;
            wrapperRef.style.left = `${left}px`;
        });
    }

    componentDidMount() {
        this.repositionWrapper();
    }

    componentDidUpdate(oldProps: RendererProps) {
        if (oldProps.codeEditorRef === this.props.codeEditorRef
        &&  oldProps.codeVisualisation === this.props.codeVisualisation) {
            return;
        }

        this.repositionWrapper();
    }

    protected get popoverProps(): Popover2Props {
        return {
            placement: "right",
            minimal: true,
            transitionDuration: 150
        };
    }

    protected get popoverContentWrapperProps(): ComponentProps<"div"> {
        return {};
    }

    protected abstract renderPopoverTarget(props: Popover2TargetProps): ReactElement;

    protected renderPopoverContent(): ReactElement {
        return <div
            className="code-visualisation-popover-content-wrapper"
            {...this.popoverContentWrapperProps}
        >
            {this.props.codeVisualisation.userInterface.createView()}
        </div>;
    }

    render() {
        return <div
            className="code-visualisation-popover-wrapper"
            ref={this.popoverWrapperRef}
        >
            <Popover2
                {...this.popoverProps}
                content={this.renderPopoverContent()}
                renderTarget={props => this.renderPopoverTarget(props)}
            />
        </div>;
    }
}