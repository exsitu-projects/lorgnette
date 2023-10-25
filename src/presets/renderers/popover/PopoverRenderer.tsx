import "./popover-renderer.css";
import React, { ComponentProps, ReactElement } from "react";
import { Renderer, RendererProps, RendererState } from "../../../core/renderers/Renderer";
import { Popover, PopoverProps, PopoverTargetProps } from "@blueprintjs/core";

export interface PopoverRendererState extends RendererState {
    isPopoverOpen: boolean;
}

export abstract class PopoverRenderer extends Renderer<RendererProps, PopoverRendererState> {
    readonly className: string = "popover";
    private popoverRef: React.RefObject<Popover<any>>;

    constructor(props: RendererProps) {
        super(props);

        this.popoverRef = React.createRef();

        this.state = {
            isPopoverOpen: this.props.projection.isActive ?? false
        };
    }

    get isActive(): boolean {
        return this.state.isPopoverOpen;
    }

    protected reposition(): void {
        this.useBoundingBoxesAfterRedraw(({ codeEditorBox, projectionFragmentBox }) => {
            const wrapperElement = this.rendererWrapperRef.current;
            if (!wrapperElement) {
                return;
            }

            // Position the wrapper next to the fragment.
            const top = projectionFragmentBox.top - codeEditorBox.top;
            const left = projectionFragmentBox.right + 10 - codeEditorBox.left;

            wrapperElement.style.top = `${top}px`;
            wrapperElement.style.left = `${left}px`;

            // Reposition the content of the popover (according to the new position of the target).
            this.popoverRef.current?.reposition();
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

    protected get popoverContentWrapperProps(): ComponentProps<"div"> {
        return {};
    }

    protected abstract renderPopoverTarget(props: PopoverTargetProps): ReactElement;

    protected renderPopoverContent(): ReactElement {
        return <div
            className="projection-popover-content-wrapper"
            {...this.popoverContentWrapperProps}
        >
            {this.props.projection.userInterface.createView()}
        </div>;
    }

    renderProjection() {
        return <Popover
            content={this.renderPopoverContent()}
            renderTarget={props => this.renderPopoverTarget(props)}
            defaultIsOpen={this.state.isPopoverOpen}
            onOpened={() => this.setState({ isPopoverOpen: true })}
            onClosed={() => this.setState({ isPopoverOpen: false })}
            ref={this.popoverRef}
            lazy={true}
            placement="right"
            minimal={true}
            transitionDuration={200}
        />;
    }
}