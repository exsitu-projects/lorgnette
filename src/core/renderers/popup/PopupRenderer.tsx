import React, { ReactElement } from "react";
import "../renderers.css";
import { Renderer, RendererProps, RendererState } from "../Renderer";
import { Overlay, OverlayProps } from "@blueprintjs/core";

export interface PopupRendererState extends RendererState {
    isPopupOpen: boolean;
};

export abstract class PopupRenderer extends Renderer<RendererProps, PopupRendererState> {
    readonly className: string = "popup";

    constructor(props: RendererProps) {
        super(props);
        this.state = {
            isPopupOpen: this.props.monocle.isActive ?? false
        };
    }

    get isActive(): boolean {
        return this.state.isPopupOpen;
    }

    protected reposition(): void {
        this.useBoundingBoxesAfterRedraw(({ codeEditorBox, monocleFragmentBox }) => {
            const wrapperElement = this.rendererWrapperRef.current;
            if (!wrapperElement) {
                return;
            }

            // Position the wrapper next to the markers' bounding box.
            const top = monocleFragmentBox.top - codeEditorBox.top;
            const left = monocleFragmentBox.right + 10 - codeEditorBox.left;

            wrapperElement.style.top = `${top}px`;
            wrapperElement.style.left = `${left}px`;
        });
    }

    componentDidMount() {
        this.reposition();
    }

    componentDidUpdate(oldProps: RendererProps) {
        if (oldProps.codeEditorRef === this.props.codeEditorRef
        &&  oldProps.monocle === this.props.monocle
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
            className="monocle-popup-content-wrapper"
            onClick={() => this.setState({ isPopupOpen: false })}
        >
            <div
                className="monocle-popup-content-panel"
                onClick={event => event.stopPropagation()}
            >
                {this.props.monocle.userInterface.createView()}
            </div>
        </div>;
    }

    renderMonocle() {
        return <>
            {this.renderPopupToggle()}
            <Overlay {...this.overlayProps}>
                {this.renderPopupContent()}
            </Overlay>
        </>;
    }
}