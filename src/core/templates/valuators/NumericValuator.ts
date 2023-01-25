import { ValuatorSettings, ValuatorValueType, deriveValuatorSettingsFromDefaults, Valuator } from "./Valuator";

export interface NumericValuatorSettings extends ValuatorSettings<ValuatorValueType.Number> {
    isIntegerValue: boolean;
    integerBase: number;
}

export function deriveNumericValuatorSettingsFromDefaults<
    S extends ValuatorSettings<ValuatorValueType.Number>
>(settings: Partial<S>): NumericValuatorSettings {
    return {
        isIntegerValue: false,
        integerBase: 10,

        ...deriveValuatorSettingsFromDefaults(settings)
    };
}

export class NumericValuator extends Valuator<
    ValuatorValueType.Number,
    NumericValuatorSettings
> {
    readonly type = ValuatorValueType.Number;

    constructor(partialSettings: Partial<NumericValuatorSettings> = {}) {
        super(
            partialSettings,
            deriveNumericValuatorSettingsFromDefaults
        );
    }

    protected convertRawValueToValue(text: string): number {
        return this.settings.isIntegerValue
            ? parseInt(text, this.settings.integerBase)
            : parseFloat(text);
    }

    protected convertValueToRawValue(newValue: number): string {
        return this.settings.isIntegerValue
            ? newValue.toString(this.settings.integerBase)
            : newValue.toString();
    }
}