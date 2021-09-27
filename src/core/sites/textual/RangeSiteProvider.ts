import { Range } from "../../documents/Range";
import { CodeVisualisationType } from "../../visualisations/CodeVisualisationType";
import { SiteProvider } from "../SiteProvider";
import { TextualSite } from "./TextualSite";

export class RangeSiteProvider implements SiteProvider<CodeVisualisationType.Textual> {
    id: string;
    startIndex: number | null;
    endIndex: number | null;

    constructor(startIndex: number, endIndex: number) {
        this.id = "new-site";
        this.startIndex = startIndex;
        this.endIndex = endIndex;
    }

    isRangeValid(): boolean {
        const noStartIndex = this.startIndex !== null;
        const noEndIndex = this.endIndex !== null;

        return (noStartIndex || this.startIndex! >= 0)
            && (noEndIndex || this.endIndex! >= 0)
            && (noStartIndex || noEndIndex || this.startIndex! <= this.endIndex!);
    }

    provideForPattern(pattern: string): TextualSite {
        const effectiveStartIndex = this.startIndex
            ? Math.max(0, this.startIndex)
            : 0;
        const effectiveEndIndex = this.endIndex
            ? Math.min(pattern.length, this.endIndex + 1)
            : pattern.length;

        const slicedPattern = pattern.slice(
            effectiveStartIndex,
            effectiveEndIndex
        );
        
        return new TextualSite(
            slicedPattern,
            Range.fromOffsetsInText(
                pattern,
                effectiveStartIndex,
                effectiveEndIndex
            )
        )
    }
}