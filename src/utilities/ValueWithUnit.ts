export class ValueWithUnit<V = number, U = string> {
    value: V;
    unit: U;

    constructor(value: V, unit: U) {
        this.value = value;
        this.unit = unit;
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