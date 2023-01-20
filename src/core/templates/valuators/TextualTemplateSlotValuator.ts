import { TemplateSlot } from "../TemplateSlot";
import { TemplateSlotValuatorSettings, TemplateSlotValueType, deriveTemplateSlotValuatorSettingsFromDefaults, TemplateSlotValuator } from "./TemplateSlotValuator";
import { TemplateSlotValuatorProvider } from "./TemplateSlotValuatorProvider";

export interface TemplateSlotTextualValuatorSettings extends TemplateSlotValuatorSettings<TemplateSlotValueType.Text> {

}

export function deriveTemplateSlotTextualValuatorSettingsFromDefaults<
    S extends TemplateSlotValuatorSettings<TemplateSlotValueType.Text>
>(settings: Partial<S>): TemplateSlotTextualValuatorSettings {
    return {
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
        return text;
    }

    convertValueToText(newValue: string): string {
        return newValue;
    }

    static makeProvider(partialSettings: Partial<TemplateSlotTextualValuatorSettings> = {}): TemplateSlotValuatorProvider {
        return {
            provideValuatorForSlot: (slot: TemplateSlot) => new TemplateSlotTextualValuator(slot, partialSettings)
        };
    }
}
