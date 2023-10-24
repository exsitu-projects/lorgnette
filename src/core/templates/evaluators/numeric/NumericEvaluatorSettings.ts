import { EvaluatorSettings, EvaluatorValueType, deriveEvaluatorSettingsFromDefaults } from "../Evaluator";


export interface NumericEvaluatorSettings extends EvaluatorSettings<EvaluatorValueType.Number> {
    isIntegerValue: boolean;
    integerBase: number;
}

export function deriveNumericEvaluatorSettingsFromDefaults<
    S extends EvaluatorSettings<EvaluatorValueType.Number>
>(settings: Partial<S>): NumericEvaluatorSettings {
    return {
        isIntegerValue: false,
        integerBase: 10,

        ...deriveEvaluatorSettingsFromDefaults(settings)
    };
}
