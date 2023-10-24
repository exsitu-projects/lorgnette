import { BooleanEvaluatorSettings, deriveBooleanEvaluatorSettingsFromDefaults } from "./BooleanEvaluatorSettings";
import { EvaluatorSettings, EvaluatorValueType, Evaluator } from "../Evaluator";

export class BooleanEvaluator extends Evaluator<
    EvaluatorValueType.Boolean,
    BooleanEvaluatorSettings
> {
    readonly type = EvaluatorValueType.Boolean;

    constructor(partialSettings: Partial<EvaluatorSettings<EvaluatorValueType.Boolean>> = {}) {
        super(
            partialSettings,
            deriveBooleanEvaluatorSettingsFromDefaults
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
