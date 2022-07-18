import { CodeEditorRanges } from "../../../context";
import { Pattern } from "../../../core/code-patterns/Pattern";
import { Range } from "../../../core/documents/Range";
import { Monocle } from "../../../core/visualisations/Monocle";
import { MonocleUid } from "../../../core/visualisations/MonocleUid";

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

function createRangeToHiglightForPattern(pattern: Pattern, id?: number): RangeToHighlight {
    return createRangeToHighlight(pattern.range, "highlight pattern", id);
}

export function createRangesToHighlightForMonocles(monocles: Monocle[]): RangeToHighlight[] {
    const rangesToHiglight: RangeToHighlight[] = [];

    for (let monocle of monocles) {
        rangesToHiglight.push(
            createRangeToHiglightForPattern(monocle.pattern, monocle.uid)
        );
    }

    return rangesToHiglight;
}

export function createRangesToHighlightFromGlobalCodeEditorRanges(ranges: CodeEditorRanges): RangeToHighlight[] {
    const rangesToHiglight: RangeToHighlight[] = [];

    // Ranges to highlight on mouse hover.
    for (let range of ranges.hovered) {
        rangesToHiglight.push(createRangeToHighlight(range, "highlight hovered"));
    }

    // Ranges to highlight on selection.
    for (let range of ranges.selected) {
        rangesToHiglight.push(createRangeToHighlight(range, "highlight selected"));
    }

    return rangesToHiglight;
}