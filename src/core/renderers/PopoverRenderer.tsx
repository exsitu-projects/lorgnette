import React, { ReactElement } from "react";
import { Button } from "@blueprintjs/core";
import { Popover2, Popover2TargetProps } from "@blueprintjs/popover2";
import { Renderer, Props } from "./Renderer";


export class PopoverRenderer extends Renderer {
    readonly name: string = "popover";

    private wrapperRef: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);
        this.wrapperRef = React.createRef();
    }

    private repositionWrapper(): void {
        // Wait for the next redraw of the webpage before updating the wrapper's position.
        // This is required to ensure that the code editor and the markers are part of the DOM
        // and positioned correctly, which is mandatory for positioning relatively to them.
        window.requestAnimationFrame(() => {
            const wrapperRef = this.wrapperRef.current;
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

            wrapperRef.style.position = "absolute";
            wrapperRef.style.top = `${top}px`;
            wrapperRef.style.left = `${left}px`;
        });
    }

    componentDidMount() {
        this.repositionWrapper();
    }

    componentDidUpdate(oldProps: Props) {
        if (oldProps.codeEditorRef === this.props.codeEditorRef
        &&  oldProps.codeVisualisation === this.props.codeVisualisation) {
            return;
        }

        this.repositionWrapper();
    }

    private renderPopoverContent(): ReactElement {
        return <div style={{ padding: "10px", backgroundColor: "#fafafa"}}>
            {this.props.codeVisualisation.userInterface.createView()}
        </div>;
    }

    private renderPopoverTarget(props: Popover2TargetProps): ReactElement {
        const { isOpen, ref,  ...targetProps } = props;
        return <Button
            elementRef={props.ref as any}
            {...targetProps}
        >
            visualisation
        </Button>;
    }

    render() {
        return <div className="code-visualisation-ui-wrapper" ref={this.wrapperRef}>
            <Popover2
                placement="right"
                minimal={true}
                transitionDuration={150}
                content={this.renderPopoverContent()}
                renderTarget={props => this.renderPopoverTarget(props)}
            />
        </div>;
    }
}