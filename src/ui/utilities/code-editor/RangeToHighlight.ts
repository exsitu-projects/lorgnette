import { CodeEditorRanges } from "../../../context";
import { Range } from "../../../core/documents/Range";
import { Fragment } from "../../../core/fragments/Fragment";
import { Monocle } from "../../../core/visualisations/Monocle";

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

function createRangeToHiglightForFragment(fragment: Fragment, id?: number): RangeToHighlight {
    return createRangeToHighlight(fragment.range, "highlight fragment", id);
}

export function createRangesToHighlightForMonocles(monocles: Monocle[]): RangeToHighlight[] {
    const rangesToHiglight: RangeToHighlight[] = [];

    for (let monocle of monocles) {
        rangesToHiglight.push(
            createRangeToHiglightForFragment(monocle.fragment, monocle.uid)
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