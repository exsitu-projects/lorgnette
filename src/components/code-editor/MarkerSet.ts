export class MarkerSet {
    readonly markers: HTMLElement[];

    constructor(markers: HTMLElement[]) {
        this.markers = markers;
    }

    get size(): number {
        return this.markers.length;
    }

    get boundingBox(): DOMRect {
        const markers = this.markers;
        const nbMarkers = this.size;

        if (nbMarkers === 0) {
            return new DOMRect(0, 0, 0, 0);
        }

        const boundingRects = markers.map(marker => marker.getBoundingClientRect());
    
        const markersSortedByTop = boundingRects.sort((box1, box2) => box2.top - box1.top);
        const minMarkerTop = markersSortedByTop[0].top;
        const maxMarkerTop = markersSortedByTop[nbMarkers - 1].top;

        const markersSortedByLeft = boundingRects.sort((box1, box2) => box2.left - box1.left);
        const minMarkerLeft = markersSortedByLeft[0].left;

        const markersSortedByRight = boundingRects.sort((box1, box2) => box2.right - box1.right);
        const maxMarkerRight = markersSortedByRight[0].right;
    
        return new DOMRect(
            minMarkerLeft,
            minMarkerTop,
            maxMarkerRight - minMarkerLeft,
            maxMarkerTop - minMarkerTop
        );
    }
}