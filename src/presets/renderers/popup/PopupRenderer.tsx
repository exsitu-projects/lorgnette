import "./style.css";
import React, { ReactElement } from "react";
import { Renderer, RendererProps, RendererState } from "../../../core/renderers/Renderer";
import { Overlay, OverlayProps } from "@blueprintjs/core";

export interface PopupRendererState extends RendererState {
    isPopupOpen: boolean;
};

export abstract class PopupRenderer extends Renderer<RendererProps, PopupRendererState> {
    readonly className: string = "popup";

    constructor(props: RendererProps) {
        super(props);
        this.state = {
            isPopupOpen: this.props.projection.isActive ?? false
        };
    }

    get isActive(): boolean {
        return this.state.isPopupOpen;
    }

    protected reposition(): void {
        this.useBoundingBoxesAfterRedraw(({ codeEditorBox, projectionFragmentBox }) => {
            const wrapperElement = this.rendererWrapperRef.current;
            if (!wrapperElement) {
                return;
            }

            // Position the wrapper next to the markers' bounding box.
            const top = projectionFragmentBox.top - codeEditorBox.top;
            const left = projectionFragmentBox.right + 10 - codeEditorBox.left;

            wrapperElement.style.top = `${top}px`;
            wrapperElement.style.left = `${left}px`;
        });
    }

    componentDidMount() {
        this.reposition();
    }

    componentDidUpdate(oldProps: RendererProps) {
        if (oldProps.codeEditorRef === this.props.codeEditorRef
        &&  oldProps.projection === this.props.projection
        &&  oldProps.codeEditorVisibleRange === this.props.codeEditorVisibleRange
        &&  oldProps.codeEditorCursorPosition === this.props.codeEditorCursorPosition) {
            return;
        }

        this.reposition();
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
            className="projection-popup-content-wrapper"
            onClick={() => this.setState({ isPopupOpen: false })}
        >
            <div
                className="projection-popup-content-panel"
                onClick={event => event.stopPropagation()}
            >
                {this.props.projection.userInterface.createView()}
            </div>
        </div>;
    }

    renderProjection() {
        return <>
            {this.renderPopupToggle()}
            <Overlay {...this.overlayProps}>
                {this.renderPopupContent()}
            </Overlay>
        </>;
    }
}