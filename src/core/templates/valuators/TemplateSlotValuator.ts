import { DocumentEditor } from "../../documents/DocumentEditor";
import { TemplateSlot } from "../TemplateSlot";

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

export interface TemplateSlotValuatorSettings<T extends TemplateSlotValueType = TemplateSlotValueType> {
    // Transformer functions that can be used to further transform values and input/output text.
    transformGetterInputText: (text: string) => string;
    transformGetterValue: (value: TemplateSlotValueOfType<T>) => any;
    transformSetterValue: (value: any) => TemplateSlotValueOfType<T>;
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
    protected settings: S;

    constructor(
        partialSettings: Partial<S> = {},
        settingsDeriverFromDefaults: (partialSettings: Partial<S>) => S
    ) {
        this.settings = settingsDeriverFromDefaults({
            transformGetterInputText: (text: string) => text,
            transformGetterValue: (value: TemplateSlotValueOfType<T>) => value,
            transformSetterValue: (value: TemplateSlotValueOfType<T>) => value,
            transformSetterOutputText: (text: string) => text,

            ...partialSettings
        });
    }

    protected abstract convertRawValueToValue(text: string): TemplateSlotValueOfType<T>;
    protected abstract convertValueToRawValue(value: TemplateSlotValueOfType<T>): string;

    getValueFromText(text: string): TemplateSlotValueOfType<T> {
        const transformedText = this.settings.transformGetterInputText(text);
        const value = this.convertRawValueToValue(transformedText);
        const transformedValue = this.settings.transformGetterValue(value);

        return transformedValue;
    }

    getValueFromSlot(slot: TemplateSlot): TemplateSlotValueOfType<T> {
        const text = slot.getText();
        return this.getValueFromText(text);
    }

    convertValueToText(value: TemplateSlotValueOfType<T>): string {
        const transformedValue = this.settings.transformSetterValue(value);
        const text = this.convertValueToRawValue(transformedValue);
        const transformedText = this.settings.transformSetterOutputText(text);

        return transformedText;
    }

    setValueInSlot(slot: TemplateSlot, newValue: TemplateSlotValueOfType<T>, documentEditor: DocumentEditor): void {
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
