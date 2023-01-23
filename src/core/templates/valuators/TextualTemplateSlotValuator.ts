import { TemplateSlot } from "../TemplateSlot";
import { TemplateSlotValuatorSettings, TemplateSlotValueType, deriveTemplateSlotValuatorSettingsFromDefaults, TemplateSlotValuator } from "./TemplateSlotValuator";
import { TemplateSlotValuatorProvider } from "./TemplateSlotValuatorProvider";

export interface TemplateSlotTextualValuatorSettings extends TemplateSlotValuatorSettings<TemplateSlotValueType.Text> {
    // List of delimiters that must be trimmed from the start and the end of the value.
    // The first delimiter of the list will be used to enclose new values if it is defined.
    ignorePairsOfDelimiters: string[] | false;
}

export function deriveTemplateSlotTextualValuatorSettingsFromDefaults<
    S extends TemplateSlotValuatorSettings<TemplateSlotValueType.Text>
>(settings: Partial<S>): TemplateSlotTextualValuatorSettings {
    return {
        ignorePairsOfDelimiters: ["\"", "'", "`"],

        ...deriveTemplateSlotValuatorSettingsFromDefaults(settings)
    };
}

export class TemplateSlotTextualValuator extends TemplateSlotValuator<
    TemplateSlotValueType.Text,
    TemplateSlotTextualValuatorSettings
> {
    readonly type = TemplateSlotValueType.Text;

    constructor(
        slot: TemplateSlot,
        partialSettings: Partial<TemplateSlotValuatorSettings<TemplateSlotValueType.Text>> = {},
    ) {
        super(
            slot,
            partialSettings,
            deriveTemplateSlotTextualValuatorSettingsFromDefaults
        );
    }

    convertTextToValue(text: string): string {
        return this.settings.ignorePairsOfDelimiters
            ? TemplateSlotTextualValuator.trimPairsOfIdentificDelimitersOff(text, this.settings.ignorePairsOfDelimiters)
            : text;
    }

    convertValueToText(newValue: string): string {
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

    static makeProvider(partialSettings: Partial<TemplateSlotTextualValuatorSettings> = {}): TemplateSlotValuatorProvider {
        return {
            provideValuatorForSlot: (slot: TemplateSlot) => new TemplateSlotTextualValuator(slot, partialSettings)
        };
    }
}
