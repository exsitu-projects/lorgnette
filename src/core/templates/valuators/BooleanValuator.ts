import { ValuatorSettings, ValuatorValueType, deriveValuatorSettingsFromDefaults, Valuator } from "./Valuator";

export interface BooleanValuatorSettings extends ValuatorSettings<ValuatorValueType.Boolean> {
    // Text to use when writing a true or false value in a document.
    trueSymbol: string;
    falseSymbol: string;

    // A function that takes the raw value as text and decides whether it is truthful or not.
    isTextTruthful(text: string) : boolean;
}

export function deriveBooleanValuatorSettingsFromDefaults<
    S extends ValuatorSettings<ValuatorValueType.Boolean>
>(settings: Partial<S>): BooleanValuatorSettings {
    return {
        trueSymbol: "true",
        falseSymbol: "false",
        isTextTruthful(text: string) { return text !== this.falseSymbol; },

        ...deriveValuatorSettingsFromDefaults(settings)
    };
}

export class BooleanValuator extends Valuator<
    ValuatorValueType.Boolean,
    BooleanValuatorSettings
> {
    readonly type = ValuatorValueType.Boolean;

    constructor(partialSettings: Partial<ValuatorSettings<ValuatorValueType.Boolean>> = {}) {
        super(
            partialSettings,
            deriveBooleanValuatorSettingsFromDefaults
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
