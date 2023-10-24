import { EvaluatorValueType, Evaluator } from "../Evaluator";
import { NumericEvaluatorSettings, deriveNumericEvaluatorSettingsFromDefaults } from "./NumericEvaluatorSettings";

export class NumericEvaluator extends Evaluator<
    EvaluatorValueType.Number,
    NumericEvaluatorSettings
> {
    readonly type = EvaluatorValueType.Number;

    constructor(partialSettings: Partial<NumericEvaluatorSettings> = {}) {
        super(
            partialSettings,
            deriveNumericEvaluatorSettingsFromDefaults
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