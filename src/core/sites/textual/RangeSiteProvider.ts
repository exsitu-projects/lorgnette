import { TextualPattern } from "../../code-patterns/textual/TextualPattern";
import { DocumentRange } from "../../documents/DocumentRange";
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

    provideForPattern(pattern: TextualPattern): TextualSite {
        const text = pattern.text;
        const effectiveStartIndex = this.startIndex
            ? Math.max(0, this.startIndex)
            : 0;
        const effectiveEndIndex = this.endIndex
            ? Math.min(text.length, this.endIndex + 1)
            : text.length;

        const slicedPattern = text.slice(
            effectiveStartIndex,
            effectiveEndIndex
        );
        
        return new TextualSite(
            slicedPattern,
            DocumentRange.fromOffsetsInDocument(
                pattern.document,
                effectiveStartIndex,
                effectiveEndIndex
            ),
            pattern
        )
    }
}