import { Fragment } from "../fragments/Fragment";
import { Monocle } from "./Monocle";

export class MonocleMatcher {
    private monocleToPreserve: Monocle;

    constructor(monocleToPreserve: Monocle) {
        this.monocleToPreserve = monocleToPreserve;
    }

    private computeDistanceWithFragments(fragment: Fragment): number {
        const fragmentStartOffset = fragment.range.start.offset;
        const fragmentEndOffset = fragment.range.end.offset;

        const startOffsetsDifference = this.monocleToPreserve.range.start.offset - fragmentStartOffset;
        const endOffsetsDifference = this.monocleToPreserve.range.end.offset - fragmentEndOffset;

        return startOffsetsDifference**2 + endOffsetsDifference**2;
    }

    findBestMatchingFragment(fragments: Fragment[]): Fragment | null {
        const nbfragments = fragments.length;
        if (nbfragments === 0) {
            return null;
        }

        let bestMatch: Fragment | null = null;
        let bestMatchDistance = Infinity;

        for (let i = 0; i < nbfragments; i++) {
            const fragment = fragments[i];
            const distance = this.computeDistanceWithFragments(fragment);
            // console.log("distance of fragment to fragment", this.monocleToPreserve, fragment.range.toPrettyString(), distance)

            if (distance < bestMatchDistance) {
                bestMatch = fragment;
                bestMatchDistance = distance;
            }
        }

        return bestMatch;
    }
}