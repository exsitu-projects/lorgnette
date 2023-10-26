import React from "react";
import { Range } from "../documents/Range";
import { DecoratedRangeId } from "./DecoratedRange";

export interface CodeEditorProps {

}

export interface CodeEditorState {

}

export abstract class CodeEditor<
    P extends CodeEditorProps = CodeEditorProps,
    S extends CodeEditorState = CodeEditorState
> extends React.Component<P, S> {
    constructor(props: P) {
        super(props);
    }

    abstract getVisibleRange(): Range;
    abstract getEditorBoundingBox(): DOMRect;
    abstract getEditorTextAreaBoundingBox(): DOMRect;
    abstract getDecorationElementsWithId(id: DecoratedRangeId): Element[];
    
    getDecorationBoundingBoxWithId(id: DecoratedRangeId): DOMRect {
        const elements = this.getDecorationElementsWithId(id);
        const nbElements = elements.length;

        if (nbElements === 0) {
            throw Error("The decoration bounding box cannot be computed: there is no element for the given ID.");
        }

        const elementBoundingBoxes = elements.map(element => element.getBoundingClientRect());
    
        const markersSortedByTop = elementBoundingBoxes.sort((box1, box2) => box2.top - box1.top);
        const minMarkerTop = markersSortedByTop[0].top;
        const maxMarkerTop = markersSortedByTop[nbElements - 1].top;

        const markersSortedByLeft = elementBoundingBoxes.sort((box1, box2) => box2.left - box1.left);
        const minMarkerLeft = markersSortedByLeft[0].left;

        const markersSortedByRight = elementBoundingBoxes.sort((box1, box2) => box2.right - box1.right);
        const maxMarkerRight = markersSortedByRight[0].right;
    
        return new DOMRect(
            minMarkerLeft,
            minMarkerTop,
            maxMarkerRight - minMarkerLeft,
            maxMarkerTop - minMarkerTop
        );
    }
}
