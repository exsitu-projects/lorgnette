import { DocumentEditor } from "../../documents/DocumentEditor";
import { TemplateSlot } from "../TemplateSlot";

export const enum ValuatorValueType {
    Number = "Number",
    Text = "Text",
    Boolean = "Boolean",
    Other = "Other"
}

export type ValuatorValueOfType<T extends ValuatorValueType = ValuatorValueType> =
    T extends ValuatorValueType.Number ? number :
    T extends ValuatorValueType.Text ? string :
    T extends ValuatorValueType.Boolean ? boolean :
    T extends ValuatorValueType.Other ? any :
    never;

export type ValuatorValue = ValuatorValueOfType<ValuatorValueType>;

export interface ValuatorSettings<T extends ValuatorValueType = ValuatorValueType> {
    // Transformer functions that can be used to further transform values and input/output text.
    transformGetterInputText: (text: string) => string;
    transformGetterValue: (value: ValuatorValueOfType<T>) => any;
    transformSetterValue: (value: any) => ValuatorValueOfType<T>;
    transformSetterOutputText: (text: string) => string;
}

export function deriveValuatorSettingsFromDefaults<
    T extends ValuatorValueType,
    S extends ValuatorSettings<T>
>(settings: Partial<S>): ValuatorSettings<T> {
    return {
        transformGetterInputText: (text: string) => text,
        transformGetterValue: (value: ValuatorValueOfType<T>) => value,
        transformSetterValue: (value: ValuatorValueOfType<T>) => value,
        transformSetterOutputText: (text: string) => text,
        
        ...settings
    };
}

export abstract class Valuator<
    T extends ValuatorValueType = ValuatorValueType,
    S extends ValuatorSettings<T> = ValuatorSettings<T>
> {
    readonly abstract type: T;
    protected settings: S;

    constructor(
        partialSettings: Partial<S> = {},
        settingsDeriverFromDefaults: (partialSettings: Partial<S>) => S
    ) {
        this.settings = settingsDeriverFromDefaults({
            transformGetterInputText: (text: string) => text,
            transformGetterValue: (value: ValuatorValueOfType<T>) => value,
            transformSetterValue: (value: ValuatorValueOfType<T>) => value,
            transformSetterOutputText: (text: string) => text,

            ...partialSettings
        });
    }

    protected abstract convertRawValueToValue(text: string): ValuatorValueOfType<T>;
    protected abstract convertValueToRawValue(value: ValuatorValueOfType<T>): string;

    getValueFromText(text: string): ValuatorValueOfType<T> {
        const transformedText = this.settings.transformGetterInputText(text);
        const value = this.convertRawValueToValue(transformedText);
        const transformedValue = this.settings.transformGetterValue(value);

        return transformedValue;
    }

    getValueFromSlot(slot: TemplateSlot): ValuatorValueOfType<T> {
        const text = slot.getText();
        return this.getValueFromText(text);
    }

    convertValueToText(value: ValuatorValueOfType<T>): string {
        const transformedValue = this.settings.transformSetterValue(value);
        const text = this.convertValueToRawValue(transformedValue);
        const transformedText = this.settings.transformSetterOutputText(text);

        return transformedText;
    }

    setValueInSlot(slot: TemplateSlot, newValue: ValuatorValueOfType<T>, documentEditor: DocumentEditor): void {
        try {
            const text = this.convertValueToText(newValue);
            slot.setText(text, documentEditor);
        }
        catch (error) {
            console.error("The valuator could not set the value of the slot:", error);
            return;
        }
    }
}
