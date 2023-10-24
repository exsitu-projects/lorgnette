import { DocumentEditor } from "../../documents/DocumentEditor";
import { TemplateSlot } from "../TemplateSlot";

export const enum EvaluatorValueType {
    Number = "Number",
    Text = "Text",
    Boolean = "Boolean",
    Other = "Other"
}

export type EvaluatorValueOfType<T extends EvaluatorValueType = EvaluatorValueType> =
    T extends EvaluatorValueType.Number ? number :
    T extends EvaluatorValueType.Text ? string :
    T extends EvaluatorValueType.Boolean ? boolean :
    T extends EvaluatorValueType.Other ? any :
    never;

export type EvaluatorValue = EvaluatorValueOfType<EvaluatorValueType>;

export interface EvaluatorSettings<T extends EvaluatorValueType = EvaluatorValueType> {
    // Transformer functions that can be used to further transform values and input/output text.
    transformGetterInputText: (text: string) => string;
    transformGetterValue: (value: EvaluatorValueOfType<T>) => any;
    transformSetterValue: (value: any) => EvaluatorValueOfType<T>;
    transformSetterOutputText: (text: string) => string;
}

export function deriveEvaluatorSettingsFromDefaults<
    T extends EvaluatorValueType,
    S extends EvaluatorSettings<T>
>(settings: Partial<S>): EvaluatorSettings<T> {
    return {
        transformGetterInputText: (text: string) => text,
        transformGetterValue: (value: EvaluatorValueOfType<T>) => value,
        transformSetterValue: (value: EvaluatorValueOfType<T>) => value,
        transformSetterOutputText: (text: string) => text,
        
        ...settings
    };
}

export abstract class Evaluator<
    T extends EvaluatorValueType = EvaluatorValueType,
    S extends EvaluatorSettings<T> = EvaluatorSettings<T>
> {
    readonly abstract type: T;
    protected settings: S;

    constructor(
        partialSettings: Partial<S> = {},
        settingsDeriverFromDefaults: (partialSettings: Partial<S>) => S
    ) {
        this.settings = settingsDeriverFromDefaults({
            transformGetterInputText: (text: string) => text,
            transformGetterValue: (value: EvaluatorValueOfType<T>) => value,
            transformSetterValue: (value: EvaluatorValueOfType<T>) => value,
            transformSetterOutputText: (text: string) => text,

            ...partialSettings
        });
    }

    protected abstract convertRawValueToValue(text: string): EvaluatorValueOfType<T>;
    protected abstract convertValueToRawValue(value: EvaluatorValueOfType<T>): string;

    getValueFromText(text: string): EvaluatorValueOfType<T> {
        const transformedText = this.settings.transformGetterInputText(text);
        const value = this.convertRawValueToValue(transformedText);
        const transformedValue = this.settings.transformGetterValue(value);

        return transformedValue;
    }

    getValueFromSlot(slot: TemplateSlot): EvaluatorValueOfType<T> {
        const text = slot.getText();
        return this.getValueFromText(text);
    }

    convertValueToText(value: EvaluatorValueOfType<T>): string {
        const transformedValue = this.settings.transformSetterValue(value);
        const text = this.convertValueToRawValue(transformedValue);
        const transformedText = this.settings.transformSetterOutputText(text);

        return transformedText;
    }

    setValueInSlot(slot: TemplateSlot, newValue: EvaluatorValueOfType<T>, documentEditor: DocumentEditor): void {
        try {
            const text = this.convertValueToText(newValue);
            slot.setText(text, documentEditor);
        }
        catch (error) {
            console.error("The evaluator could not set the value of the slot:", error);
            return;
        }
    }
}
