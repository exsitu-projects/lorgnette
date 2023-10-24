import { EvaluatorValueType, Evaluator } from "../Evaluator";
import { TextualEvaluatorSettings, deriveTextualEvaluatorSettingsFromDefaults } from "./TextualEvaluatorSettings";

export class TextualEvaluator extends Evaluator<
    EvaluatorValueType.Text,
    TextualEvaluatorSettings
> {
    readonly type = EvaluatorValueType.Text;

    constructor(partialSettings: Partial<TextualEvaluatorSettings> = {}) {
        super(
            partialSettings,
            deriveTextualEvaluatorSettingsFromDefaults
        );
    }

    protected convertRawValueToValue(text: string): string {
        return this.settings.ignorePairsOfDelimiters
            ? TextualEvaluator.trimPairsOfIdenticDelimitersOff(text, this.settings.ignorePairsOfDelimiters)
            : text;
    }

    protected convertValueToRawValue(newValue: string): string {
        if (this.settings.ignorePairsOfDelimiters) {
            const delimiter = this.settings.ignorePairsOfDelimiters[0];
            return `${delimiter}${newValue}${delimiter}`;
        }

        return newValue;
    }

    protected static trimPairsOfIdenticDelimitersOff(text: string, delimiters: string[]): string {
        const textLength = text.length;
        if (textLength < 2) {
            console.warn(`The text "${text}" was not trimmed: it contains <2 characters.`);
            return text;
        }

        const firstCharacter = text[0];
        const firstCharacterIsADelimiter = delimiters.includes(firstCharacter);
        if (firstCharacterIsADelimiter) {
            const lastCharacter = text[textLength - 1];
            const lastCharacterIsTheSameDelimiter = lastCharacter === firstCharacter;

            if (lastCharacterIsTheSameDelimiter) {
                return text.substring(1, textLength - 1);
            }
        }

        return text;
    }
}
