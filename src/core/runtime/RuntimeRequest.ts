import { Position } from "../documents/Position";
import { Fragment } from "../fragments/Fragment";

export type RuntimeRequestId = number;
export type RuntimeRequestExpression = string;

// Function to generate unique IDs for new runtime requests.
let nextUnusedRuntimeId: RuntimeRequestId = 1;

function getUnusedRuntimeId(): RuntimeRequestId {
    const id = nextUnusedRuntimeId;
    nextUnusedRuntimeId += 1;

    return id;
}

export interface RawRuntimeRequest {
    readonly id: number;
    readonly position: { line: number, column: number };
    readonly expression: string;  
}

export class RuntimeRequest {
    readonly id: RuntimeRequestId;
    readonly name: string;
    readonly position: Position;
    readonly expression: RuntimeRequestExpression;

    constructor(
        id: RuntimeRequestId,
        name: string,
        position: Position,
        expression: RuntimeRequestExpression
    ) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.expression = expression;
    }

    get raw(): RawRuntimeRequest {
        return {
            id: this.id,
            position: { line: this.position.row, column: this.position.column },
            expression: this.expression
        };
    }

    static createForFragment(fragment: Fragment, name: string, expression: RuntimeRequestExpression): RuntimeRequest {
        return new RuntimeRequest(
            getUnusedRuntimeId(),
            name,
            fragment.range.start,
            expression
        );
    }
}
