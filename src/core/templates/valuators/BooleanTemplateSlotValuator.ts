import { TemplateSlot } from "../TemplateSlot";
import { TemplateSlotValuatorSettings, TemplateSlotValueType, deriveTemplateSlotValuatorSettingsFromDefaults, TemplateSlotValuator } from "./TemplateSlotValuator";
import { TemplateSlotValuatorProvider } from "./TemplateSlotValuatorProvider";

export interface TemplateSlotBooleanValuatorSettings extends TemplateSlotValuatorSettings<TemplateSlotValueType.Boolean> {
    // Text to use when writing a true or false value in a document.
    trueSymbol: string;
    falseSymbol: string;

    // A function that takes the raw value as text and decides whether it is truthful or not.
    isTextTruthful(text: string) : boolean;
}

export function deriveTemplateSlotBooleanValuatorSettingsFromDefaults<
    S extends TemplateSlotValuatorSettings<TemplateSlotValueType.Boolean>
>(settings: Partial<S>): TemplateSlotBooleanValuatorSettings {
    return {
        trueSymbol: "true",
        falseSymbol: "false",
        isTextTruthful(text: string) { return text !== this.falseSymbol; },

        ...deriveTemplateSlotValuatorSettingsFromDefaults(settings)
    };
}

export class TemplateSlotBooleanValuator extends TemplateSlotValuator<
    TemplateSlotValueType.Boolean,
    TemplateSlotBooleanValuatorSettings
> {
    readonly type = TemplateSlotValueType.Boolean;

    constructor(
        slot: TemplateSlot,
        partialSettings: Partial<TemplateSlotValuatorSettings<TemplateSlotValueType.Boolean>> = {}
    ) {
        super(
            slot,
            partialSettings,
            deriveTemplateSlotBooleanValuatorSettingsFromDefaults
        );
    }

    convertTextToValue(text: string): boolean {
        return this.settings.isTextTruthful(text);
    }

    convertValueToText(newValue: boolean): string {
        return newValue
            ? this.settings.trueSymbol
            : this.settings.falseSymbol;
    }

    static makeProvider(partialSettings: Partial<TemplateSlotBooleanValuatorSettings> = {}): TemplateSlotValuatorProvider {
        return {
            provideValuatorForSlot: (slot: TemplateSlot) => new TemplateSlotBooleanValuator(slot, partialSettings)
        };
    }
}
