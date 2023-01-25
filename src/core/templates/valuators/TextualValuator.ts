import { ValuatorSettings, ValuatorValueType, deriveValuatorSettingsFromDefaults, Valuator } from "./Valuator";

export interface TextualValuatorSettings extends ValuatorSettings<ValuatorValueType.Text> {
    // List of delimiters that must be trimmed from the start and the end of the value.
    // The first delimiter of the list will be used to enclose new values if it is defined.
    ignorePairsOfDelimiters: string[] | false;
}

export function deriveTextualValuatorSettingsFromDefaults<
    S extends ValuatorSettings<ValuatorValueType.Text>
>(settings: Partial<S>): TextualValuatorSettings {
    return {
        ignorePairsOfDelimiters: ["\"", "'", "`"],

        ...deriveValuatorSettingsFromDefaults(settings)
    };
}

export class TextualValuator extends Valuator<
    ValuatorValueType.Text,
    TextualValuatorSettings
> {
    readonly type = ValuatorValueType.Text;

    constructor(partialSettings: Partial<TextualValuatorSettings> = {}) {
        super(
            partialSettings,
            deriveTextualValuatorSettingsFromDefaults
        );
    }

    protected convertRawValueToValue(text: string): string {
        return this.settings.ignorePairsOfDelimiters
            ? TextualValuator.trimPairsOfIdentificDelimitersOff(text, this.settings.ignorePairsOfDelimiters)
            : text;
    }

    protected convertValueToRawValue(newValue: string): string {
        if (this.settings.ignorePairsOfDelimiters) {
            const delimiter = this.settings.ignorePairsOfDelimiters[0];
            return `${delimiter}${newValue}${delimiter}`;
        }

        return newValue;
    }

    protected static trimPairsOfIdentificDelimitersOff(text: string, delimiters: string[]): string {
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
