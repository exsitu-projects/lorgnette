import { Fragment } from "../fragments/Fragment";
import { Projection } from "./Projection";

export class ProjectionMatcher {
    private projectionToPreserve: Projection;

    constructor(projectionToPreserve: Projection) {
        this.projectionToPreserve = projectionToPreserve;
    }

    private computeDistanceWithFragments(fragment: Fragment): number {
        const fragmentStartOffset = fragment.range.start.offset;
        const fragmentEndOffset = fragment.range.end.offset;

        const startOffsetsDifference = this.projectionToPreserve.range.start.offset - fragmentStartOffset;
        const endOffsetsDifference = this.projectionToPreserve.range.end.offset - fragmentEndOffset;

        return startOffsetsDifference**2 + endOffsetsDifference**2;
    }

    findBestMatchingFragment(fragments: Fragment[]): Fragment | null {
        const nbFragments = fragments.length;
        if (nbFragments === 0) {
            return null;
        }

        let bestMatch: Fragment | null = null;
        let bestMatchDistance = Infinity;

        for (let i = 0; i < nbFragments; i++) {
            const fragment = fragments[i];
            const distance = this.computeDistanceWithFragments(fragment);
            // console.log("distance of fragment to fragment", this.projectionToPreserve, fragment.range.toPrettyString(), distance)

            if (distance < bestMatchDistance) {
                bestMatch = fragment;
                bestMatchDistance = distance;
            }
        }

        return bestMatch;
    }
}