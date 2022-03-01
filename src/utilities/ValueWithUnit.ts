export class ValueWithUnit<V = number, U = string> {
    value: V;
    unit: U;

    constructor(value: V, unit: U) {
        this.value = value;
        this.unit = unit;
    }

    with(changes: Partial<ValueWithUnit<V, U>>): ValueWithUnit<V, U> {
        return new ValueWithUnit(
            changes.value ?? this.value,
            changes.unit ?? this.unit
        );
    }

    toString(): string {
        return `${this.value}${this.unit}`;
    }

    static fromText(text: string): ValueWithUnit<number, string> | null {
        const regex = /\s*([+-]?(?:\d*.\d+)|\d+)\s*(\S*)\s*/;
        const execResults = regex.exec(text);

        if (!execResults) {
            return null;
        }

        return new ValueWithUnit(
            Number(execResults[1]),
            execResults[2],
        );
    }
}