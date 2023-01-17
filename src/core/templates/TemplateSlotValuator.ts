import { TemplateSlot } from "./TemplateSlot";

export const enum TemplateSlotValueType {
    Number = "Number",
    Text = "Text",
    Boolean = "Boolean",
    Other = "Other"
}

export type TemplateSlotValueOfType<T extends TemplateSlotValueType = TemplateSlotValueType> =
    T extends TemplateSlotValueType.Number ? number :
    T extends TemplateSlotValueType.Text ? string :
    T extends TemplateSlotValueType.Boolean ? boolean :
    T extends TemplateSlotValueType.Other ? any :
    never;

export type TemplateSlotTypedValueOfType<T extends TemplateSlotValueType = TemplateSlotValueType> =
    { type: T, value: TemplateSlotValueOfType<T> }

export type TemplateSlotTypedValue =
    | { type: TemplateSlotValueType.Number, value: number }
    | { type: TemplateSlotValueType.Text, value: string }
    | { type: TemplateSlotValueType.Boolean, value: boolean }
    | { type: TemplateSlotValueType.Other, value: any };

// export function isTypedValueOfType<T extends TemplateSlotValueType>(
//     typedValue: TemplateSlotTypedValueOfType<T>,
//     type: T
// ): typedValue is 

// Utility type used to implement other types.
// It maps a slot value type (from the enumeration above) to the type of the related typed value.
// type TemplateSlotValueTypesToTypedValues = { [K in TemplateSlotValueType]: Extract<TemplateSlotTypedValue, { type: K }> };

// export type TemplateSlotTypedValueOfType<T extends TemplateSlotValueType = TemplateSlotValueType> =
//     TemplateSlotValueTypesToTypedValues[T];

// export type TemplateSlotValueOfType<T extends TemplateSlotValueType = TemplateSlotValueType> =
//     TemplateSlotTypedValueOfType<T>["value"];

// export type TemplateSlotValueGetter<T extends TemplateSlotValueType> =
//     (slot: TemplateSlot<T>) => TemplateSlotTypedValueOfType<T>;

// export type TemplateSlotValueSetter<T extends TemplateSlotValueType> =
//     (newValue: TemplateSlotTypedValueOfType<T>, slot: TemplateSlot<T>) => void;

export abstract class TemplateSlotValuator<T extends TemplateSlotValueType = TemplateSlotValueType> {
    readonly abstract type: T;
    protected slot: TemplateSlot;

    constructor(slot: TemplateSlot) {
        this.slot = slot;
    }

    abstract convertTextToValue(text: string): TemplateSlotValueOfType<T>;
    abstract convertValueToText(value: TemplateSlotValueOfType<T>): string;

    protected wrapValueWithType(value: TemplateSlotValueOfType<T>): TemplateSlotTypedValueOfType<T> {
        return {
            type: this.type,
            value: value
        };
    }

    protected unwrapTypedValue(typedValue: TemplateSlotTypedValue): TemplateSlotValueOfType<T> {
        if (typedValue.type !== this.type) {
            throw new Error(`A template slot valuator of type ${this.type}} cannot unwrap a typed value of type ${typedValue.type}.`);
        }
        
        return typedValue.value;
    }

    getValue(): TemplateSlotTypedValueOfType<T> {
        const value = this.convertTextToValue(this.slot.getText());
        return this.wrapValueWithType(value);
    }

    setValue(newTypedValue: TemplateSlotTypedValue): void {
        try {
            const value = this.unwrapTypedValue(newTypedValue);
            this.slot.setText(this.convertValueToText(value));
        }
        catch (error) {
            console.error("The valuator could not set the value of the slot:", error);
            return;
        }
    }
}

export class TemplateSlotNumericValuator extends TemplateSlotValuator<TemplateSlotValueType.Number> {
    readonly type = TemplateSlotValueType.Number;

    convertTextToValue(text: string): number {
        return Number(text);
    }

    convertValueToText(newValue: number): string {
        return newValue.toString();
    }
}

export class TemplateSlotTextualValuator extends TemplateSlotValuator<TemplateSlotValueType.Text> {
    readonly type = TemplateSlotValueType.Text;

    convertTextToValue(text: string): string {
        return text;
    }

    convertValueToText(newValue: string): string {
        return newValue;
    }
}

export class TemplateSlotBooleanValuator extends TemplateSlotValuator<TemplateSlotValueType.Boolean> {
    readonly type = TemplateSlotValueType.Boolean;

    // Note: the following properties can be overriden to change the strings
    // used in the setter that represent true and false values in the code.
    protected trueSymbol: string = "true";
    protected falseSymbol: string = "false";

    // Note: this method can be overriden to change what is considered a true value by the getter.
    // By default, everything different from the false symbol is considered to be true.
    protected isRawValueTruthful(rawValue: string): boolean {
        return rawValue !== this.falseSymbol;
    }

    convertTextToValue(text: string): boolean {
        return this.isRawValueTruthful(text);
    }

    convertValueToText(newValue: boolean): string {
        return newValue
            ? this.trueSymbol
            : this.falseSymbol;
    }
}
