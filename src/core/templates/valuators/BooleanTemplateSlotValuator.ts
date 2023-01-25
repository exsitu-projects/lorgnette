import { TemplateSlotValuatorSettings, TemplateSlotValueType, deriveTemplateSlotValuatorSettingsFromDefaults, TemplateSlotValuator } from "./TemplateSlotValuator";

export interface TemplateSlotBooleanValuatorSettings extends TemplateSlotValuatorSettings<TemplateSlotValueType.Boolean> {
    // Text to use when writing a true or false value in a document.
    trueSymbol: string;
    falseSymbol: string;

    // A function that takes the raw value as text and decides whether it is truthful or not.
    isTextTruthful(text: string) : boolean;
}

export function deriveTemplateSlotBooleanValuatorSettingsFromDefaults<
    S extends TemplateSlotValuatorSettings<TemplateSlotValueType.Boolean>
>(settings: Partial<S>): TemplateSlotBooleanValuatorSettings {
    return {
        trueSymbol: "true",
        falseSymbol: "false",
        isTextTruthful(text: string) { return text !== this.falseSymbol; },

        ...deriveTemplateSlotValuatorSettingsFromDefaults(settings)
    };
}

export class TemplateSlotBooleanValuator extends TemplateSlotValuator<
    TemplateSlotValueType.Boolean,
    TemplateSlotBooleanValuatorSettings
> {
    readonly type = TemplateSlotValueType.Boolean;

    constructor(partialSettings: Partial<TemplateSlotValuatorSettings<TemplateSlotValueType.Boolean>> = {}) {
        super(
            partialSettings,
            deriveTemplateSlotBooleanValuatorSettingsFromDefaults
        );
    }

    protected convertRawValueToValue(text: string): boolean {
        return this.settings.isTextTruthful(text);
    }

    protected convertValueToRawValue(newValue: boolean): string {
        return newValue
            ? this.settings.trueSymbol
            : this.settings.falseSymbol;
    }
}
