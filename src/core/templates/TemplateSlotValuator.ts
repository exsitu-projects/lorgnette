import { type } from "os";
import { DocumentEditor } from "../documents/DocumentEditor";
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

export type TemplateSlotValue = TemplateSlotValueOfType<TemplateSlotValueType>;

// TODO: remove this useless type?
export type TemplateSlotTypedValueOfType<T extends TemplateSlotValueType = TemplateSlotValueType> =
    { type: T, value: TemplateSlotValueOfType<T> }

// TODO: remove this useless type?
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

export interface TemplateSlotValuatorSettings<T extends TemplateSlotValueType> {
    // Transformer functions that can be used to further transform values and input/output text.
    transformGetterInputText: (text: string) => string;
    transformGetterValue: (value: TemplateSlotValueOfType<T>) => TemplateSlotValueOfType<T>;
    transformSetterValue: (value: TemplateSlotValueOfType<T>) => TemplateSlotValueOfType<T>;
    transformSetterOutputText: (text: string) => string;
}

export function deriveTemplateSlotValuatorSettingsFromDefaults<
    T extends TemplateSlotValueType,
    S extends TemplateSlotValuatorSettings<T>
>(settings: Partial<S>): TemplateSlotValuatorSettings<T> {
    return {
        transformGetterInputText: (text: string) => text,
        transformGetterValue: (value: TemplateSlotValueOfType<T>) => value,
        transformSetterValue: (value: TemplateSlotValueOfType<T>) => value,
        transformSetterOutputText: (text: string) => text,
        
        ...settings
    };
}

export abstract class TemplateSlotValuator<
    T extends TemplateSlotValueType = TemplateSlotValueType,
    S extends TemplateSlotValuatorSettings<T> = TemplateSlotValuatorSettings<T>
> {
    readonly abstract type: T;
    protected slot: TemplateSlot;
    protected settings: S;

    constructor(
        slot: TemplateSlot,
        partialSettings: Partial<S> = {},
        settingsDeriverFromDefaults: (partialSettings: Partial<S>) => S
    ) {
        this.slot = slot;
        this.settings = settingsDeriverFromDefaults({
            transformGetterInputText: (text: string) => text,
            transformGetterValue: (value: TemplateSlotValueOfType<T>) => value,
            transformSetterValue: (value: TemplateSlotValueOfType<T>) => value,
            transformSetterOutputText: (text: string) => text,

            ...partialSettings
        })
    }

    abstract convertTextToValue(text: string): TemplateSlotValueOfType<T>;
    abstract convertValueToText(value: TemplateSlotValueOfType<T>): string;

    // protected wrapValueWithType(value: TemplateSlotValueOfType<T>): TemplateSlotTypedValueOfType<T> {
    //     return {
    //         type: this.type,
    //         value: value
    //     };
    // }

    // protected unwrapTypedValue(typedValue: TemplateSlotTypedValue): TemplateSlotValueOfType<T> {
    //     if (typedValue.type !== this.type) {
    //         throw new Error(`A template slot valuator of type ${this.type}} cannot unwrap a typed value of type ${typedValue.type}.`);
    //     }
        
    //     return typedValue.value;
    // }

    getValue(): TemplateSlotValueOfType<T> {
        const text = this.slot.getText();
        const transformedText = this.settings.transformGetterInputText(text);
        const value = this.convertTextToValue(transformedText);
        const transformedValue = this.settings.transformGetterValue(value);

        return transformedValue;
    }

    setValue(newValue: TemplateSlotValueOfType<T>, documentEditor: DocumentEditor): void {
        try {
            const transformedValue = this.settings.transformSetterValue(newValue);
            const text = this.convertValueToText(transformedValue);
            const transformedText = this.settings.transformSetterOutputText(text);

            this.slot.setText(transformedText, documentEditor);
        }
        catch (error) {
            console.error("The valuator could not set the value of the slot:", error);
            return;
        }
    }
}

// export type TemplateSlotValuatorProvider<
//     T extends TemplateSlotValueType = TemplateSlotValueType,
//     S extends TemplateSlotValuatorSettings<T> = TemplateSlotValuatorSettings<T>
// > = (slot: TemplateSlot) => TemplateSlotValuator<T, S>;

export interface TemplateSlotValuatorProvider {
    provideValuatorForSlot(slot: TemplateSlot): TemplateSlotValuator
};

export interface TemplateSlotNumericValuatorSettings extends TemplateSlotValuatorSettings<TemplateSlotValueType.Number> {
    isIntegerValue: boolean;
    integerBase: number;
}

export function deriveTemplateSlotNumericValuatorSettingsFromDefaults<
    S extends TemplateSlotValuatorSettings<TemplateSlotValueType.Number>
>(settings: Partial<S>): TemplateSlotNumericValuatorSettings {
    return {
        isIntegerValue: false,
        integerBase: 10,

        ...deriveTemplateSlotValuatorSettingsFromDefaults(settings)
    };
}

export class TemplateSlotNumericValuator extends TemplateSlotValuator<
    TemplateSlotValueType.Number,
    TemplateSlotNumericValuatorSettings
> {
    readonly type = TemplateSlotValueType.Number;

    constructor(slot: TemplateSlot, partialSettings: Partial<TemplateSlotNumericValuatorSettings> = {}) {
        super(
            slot,
            partialSettings,
            deriveTemplateSlotNumericValuatorSettingsFromDefaults
        );
    }

    convertTextToValue(text: string): number {
        return this.settings.isIntegerValue
            ? parseInt(text, this.settings.integerBase)
            : parseFloat(text);
    }

    convertValueToText(newValue: number): string {
        return this.settings.isIntegerValue
            ? newValue.toString(this.settings.integerBase)
            : newValue.toString();
    }

    static makeProvider(partialSettings: Partial<TemplateSlotNumericValuatorSettings> = {}): TemplateSlotValuatorProvider {
        return {
            provideValuatorForSlot: (slot: TemplateSlot) => new TemplateSlotNumericValuator(slot, partialSettings)
        };
    }
}

export interface TemplateSlotTextualValuatorSettings extends TemplateSlotValuatorSettings<TemplateSlotValueType.Text> {

}

export function deriveTemplateSlotTextualValuatorSettingsFromDefaults<
    S extends TemplateSlotValuatorSettings<TemplateSlotValueType.Text>
>(settings: Partial<S>): TemplateSlotTextualValuatorSettings {
    return {
        ...deriveTemplateSlotValuatorSettingsFromDefaults(settings)
    };
}

export class TemplateSlotTextualValuator extends TemplateSlotValuator<
    TemplateSlotValueType.Text,
    TemplateSlotTextualValuatorSettings
> {
    readonly type = TemplateSlotValueType.Text;

    constructor(
        slot: TemplateSlot,
        partialSettings: Partial<TemplateSlotValuatorSettings<TemplateSlotValueType.Text>> = {}
    ) {
        super(
            slot,
            partialSettings,
            deriveTemplateSlotValuatorSettingsFromDefaults
        );
    }

    convertTextToValue(text: string): string {
        return text;
    }

    convertValueToText(newValue: string): string {
        return newValue;
    }

    static makeProvider(partialSettings: Partial<TemplateSlotTextualValuatorSettings> = {}): TemplateSlotValuatorProvider {
        return {
            provideValuatorForSlot: (slot: TemplateSlot) => new TemplateSlotTextualValuator(slot, partialSettings)
        };
    }
}

export interface TemplateSlotBooleanValuatorSettings extends TemplateSlotValuatorSettings<TemplateSlotValueType.Boolean> {

}

export function deriveTemplateSlotBooleanValuatorSettingsFromDefaults<
    S extends TemplateSlotValuatorSettings<TemplateSlotValueType.Boolean>
>(settings: Partial<S>): TemplateSlotBooleanValuatorSettings {
    return {
        ...deriveTemplateSlotValuatorSettingsFromDefaults(settings)
    };
}

export class TemplateSlotBooleanValuator extends TemplateSlotValuator<
    TemplateSlotValueType.Boolean,
    TemplateSlotBooleanValuatorSettings
> {
    readonly type = TemplateSlotValueType.Boolean;

    // Note: the following properties can be overriden to change the strings
    // used in the setter that represent true and false values in the code.
    protected trueSymbol: string = "true";
    protected falseSymbol: string = "false";

    constructor(
        slot: TemplateSlot,
        partialSettings: Partial<TemplateSlotValuatorSettings<TemplateSlotValueType.Boolean>> = {}
    ) {
        super(
            slot,
            partialSettings,
            deriveTemplateSlotValuatorSettingsFromDefaults
        );
    }

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

    static makeProvider(partialSettings: Partial<TemplateSlotBooleanValuatorSettings> = {}): TemplateSlotValuatorProvider {
        return {
            provideValuatorForSlot: (slot: TemplateSlot) => new TemplateSlotBooleanValuator(slot, partialSettings)
        };
    }
}
