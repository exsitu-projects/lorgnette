import React, { ReactElement } from "react";
import "../renderers.css";
import { Renderer, RendererProps, RendererState } from "../Renderer";
import { Overlay, OverlayProps } from "@blueprintjs/core";

export interface PopupRendererState extends RendererState {
    isPopupOpen: boolean;
};

export abstract class PopupRenderer extends Renderer<RendererProps, PopupRendererState> {
    protected popupWrapperRef: React.RefObject<HTMLDivElement>;

    constructor(props: RendererProps) {
        super(props);

        this.popupWrapperRef = React.createRef();
        this.state = {
            isPopupOpen: false
        };
    }

    protected repositionWrapper(): void {
        // Wait for the next redraw of the webpage before updating the wrapper's position.
        // This is required to ensure that the code editor and the markers are part of the DOM
        // and positioned correctly, which is mandatory for positioning relatively to them.
        window.requestAnimationFrame(() => {
            const wrapperRef = this.popupWrapperRef.current;
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
            const left = visualisedCodeBoundingBox.right + 10;

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

    protected get overlayProps(): OverlayProps {
        return {
            isOpen: this.state.isPopupOpen,
            canOutsideClickClose: true,
            canEscapeKeyClose: true
        };
    }

    protected abstract renderPopupToggle(): ReactElement;

    protected renderPopupContent(): ReactElement {
        return <div
            className="code-visualisation-popup-content-wrapper"
            onClick={() => this.setState({ isPopupOpen: false })}
        >
            <div className="code-visualisation-popup-content-panel">
                {this.props.codeVisualisation.userInterface.createView()}
            </div>
        </div>;
    }

    render() {
        return <div
            className="code-visualisation-popup-wrapper"
            ref={this.popupWrapperRef}
        >
            {this.renderPopupToggle()}
            <Overlay {...this.overlayProps}>
                {this.renderPopupContent()}
            </Overlay>
        </div>;
    }
}