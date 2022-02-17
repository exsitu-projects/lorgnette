import { CodeEditorRanges } from "../../../context";
import { Pattern } from "../../../core/code-patterns/Pattern";
import { Range } from "../../../core/documents/Range";
import { Site } from "../../../core/sites/Site";
import { CodeVisualisation } from "../../../core/visualisations/CodeVisualisation";
import { CodeVisualisationId } from "../../../core/visualisations/CodeVisualisationId";

/* `start` and `end` use 0-based row and column indices. */
export interface RangeToHighlight {
    start: { row: number, column: number};
    end: { row: number, column: number};
    className: string;
    id?: number;
}

export function createRangeToHighlight(range: Range, className: string, id?: number): RangeToHighlight {
    const rangeToHighlight: RangeToHighlight = {
        start: range.start,
        end: range.end,
        className: className
    };

    if (id !== undefined) {
        rangeToHighlight.id = id;
    }

    return rangeToHighlight;
}

function createRangeToHiglightForPattern(pattern: Pattern, id: CodeVisualisationId): RangeToHighlight {
    return createRangeToHighlight(pattern.range, "highlight pattern", id);
}

function createRangeToHiglightForSite(site: Site, pattern: Pattern): RangeToHighlight {
    const absoluteSiteRange = site.range.relativeTo(pattern.range.start);
    return createRangeToHighlight(absoluteSiteRange, "highlight site");
}

export function createRangesToHighlightForCodeVisualisations(visualisations: CodeVisualisation[]): RangeToHighlight[] {
    const rangesToHiglight: RangeToHighlight[] = [];

    for (let visualisation of visualisations) {
        const pattern = visualisation.pattern;

        rangesToHiglight.push(createRangeToHiglightForPattern(pattern, visualisation.id));
        for (let site of visualisation.sites) {
            rangesToHiglight.push(createRangeToHiglightForSite(site, pattern));
        }
    }

    return rangesToHiglight;
}

export function createRangesToHighlightFromGlobalCodeEditorRanges(ranges: CodeEditorRanges): RangeToHighlight[] {
    const rangesToHiglight: RangeToHighlight[] = [];

    // Ranges to highlight on mouse hover
    for (let range of ranges.hovered) {
        rangesToHiglight.push(createRangeToHighlight(range, "highlight hovered"));
    }

    // Ranges to highlight on selection
    for (let range of ranges.selected) {
        rangesToHiglight.push(createRangeToHighlight(range, "highlight selected"));
    }

    return rangesToHiglight;
}