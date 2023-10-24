import { EvaluatorSettings, EvaluatorValueType, deriveEvaluatorSettingsFromDefaults } from "../Evaluator";


export interface TextualEvaluatorSettings extends EvaluatorSettings<EvaluatorValueType.Text> {
    // List of delimiters that must be trimmed from the start and the end of the value.
    // The first delimiter of the list will be used to enclose new values if it is defined.
    ignorePairsOfDelimiters: string[] | false;
}

export function deriveTextualEvaluatorSettingsFromDefaults<
    S extends EvaluatorSettings<EvaluatorValueType.Text>
>(settings: Partial<S>): TextualEvaluatorSettings {
    return {
        ignorePairsOfDelimiters: ["\"", "'", "`"],

        ...deriveEvaluatorSettingsFromDefaults(settings)
    };
}
