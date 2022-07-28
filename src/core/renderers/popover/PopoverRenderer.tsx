import React, { ComponentProps, ReactElement } from "react";
import "../renderers.css";
import { Popover2, Popover2Props, Popover2TargetProps } from "@blueprintjs/popover2";
import { Renderer, RendererProps, RendererState } from "../Renderer";

export interface PopoverRendererState extends RendererState {
    isPopoverOpen: boolean;
}

export abstract class PopoverRenderer extends Renderer<RendererProps, PopoverRendererState> {
    readonly className: string = "popover";
    private popoverRef: React.RefObject<Popover2<any>>;

    constructor(props: RendererProps) {
        super(props);

        this.popoverRef = React.createRef();

        this.state = {
            isPopoverOpen: this.props.monocle.isActive ?? false
        };
    }

    get isActive(): boolean {
        return this.state.isPopoverOpen;
    }

    protected reposition(): void {
        this.useBoundingBoxesAfterRedraw(({ codeEditorBox, monocleFragmentBox }) => {
            const wrapperElement = this.rendererWrapperRef.current;
            if (!wrapperElement) {
                return;
            }

            // Position the wrapper next to the fragment.
            const top = monocleFragmentBox.top - codeEditorBox.top;
            const left = monocleFragmentBox.right + 10 - codeEditorBox.left;

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
        &&  oldProps.monocle === this.props.monocle
        &&  oldProps.codeEditorVisibleRange === this.props.codeEditorVisibleRange
        &&  oldProps.codeEditorCursorPosition === this.props.codeEditorCursorPosition) {
            return;
        }

        this.reposition();
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
            className="monocle-popover-content-wrapper"
            {...this.popoverContentWrapperProps}
        >
            {this.props.monocle.userInterface.createView()}
        </div>;
    }

    renderMonocle() {
        return <Popover2
            {...this.popoverProps}
            content={this.renderPopoverContent()}
            renderTarget={props => this.renderPopoverTarget(props)}
            defaultIsOpen={this.state.isPopoverOpen}
            onOpened={() => this.setState({ isPopoverOpen: true })}
            onClosed={() => this.setState({ isPopoverOpen: false })}
            ref={this.popoverRef}
            usePortal={true}
            portalContainer={document.body}
        />;
    }
}