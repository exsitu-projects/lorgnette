import { EvaluatorSettings, EvaluatorValueType, deriveEvaluatorSettingsFromDefaults } from "../Evaluator";


export interface BooleanEvaluatorSettings extends EvaluatorSettings<EvaluatorValueType.Boolean> {
    // Text to use when writing a true or false value in a document.
    trueSymbol: string;
    falseSymbol: string;

    // A function that takes the raw value as text and decides whether it is truthful or not.
    isTextTruthful(text: string): boolean;
}

export function deriveBooleanEvaluatorSettingsFromDefaults<
    S extends EvaluatorSettings<EvaluatorValueType.Boolean>
>(settings: Partial<S>): BooleanEvaluatorSettings {
    return {
        trueSymbol: "true",
        falseSymbol: "false",
        isTextTruthful(text: string) { return text !== this.falseSymbol; },

        ...deriveEvaluatorSettingsFromDefaults(settings)
    };
}
