import { Range } from "../documents/Range";
import { Projection } from "../projections/Projection";

export type DecoratedRangeId = number;

export const enum DecoratedRangeType {
    Fragment = "fragment",
    ActiveFragment = "fragment active",
    Highlighted = "highlighted"
}

export class DecoratedRange {
    static readonly className: string = "decorated-range";

    readonly range: Range;
    readonly type: DecoratedRangeType;
    readonly id?: DecoratedRangeId;

    constructor(range: Range, type: DecoratedRangeType, id?: DecoratedRangeId) {
        this.range = range;
        this.type = type;
        this.id = id;
    }

    get className(): string {
        const idClassName = this.id !== undefined ? DecoratedRange.classNameForId(this.id) : "";
        return `${DecoratedRange.className} ${this.type} ${idClassName}`
    }

    static classNameForId(id: DecoratedRangeId): string {
        return `id-${id}`;
    }

    static fromHighlightedRange(range: Range): DecoratedRange {
        return new DecoratedRange(
            range,
            DecoratedRangeType.Highlighted
        );
    }

    static fromProjection(projection: Projection, isActive: boolean = false): DecoratedRange {
        return new DecoratedRange(
            projection.fragment.range,
            isActive ? DecoratedRangeType.ActiveFragment : DecoratedRangeType.Fragment,
            projection.uid
        );
    }
}
