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
