import { TemplateSlot } from "../TemplateSlot";
import { TemplateSlotValuatorSettings, TemplateSlotValueType, deriveTemplateSlotValuatorSettingsFromDefaults, TemplateSlotValuator } from "./TemplateSlotValuator";
import { TemplateSlotValuatorProvider } from "./TemplateSlotValuatorProvider";

export interface TemplateSlotNumericValuatorSettings extends TemplateSlotValuatorSettings<TemplateSlotValueType.Number> {
    isIntegerValue: boolean;
    integerBase: number;
}

export function deriveTemplateSlotNumericValuatorSettingsFromDefaults<
    S extends TemplateSlotValuatorSettings<TemplateSlotValueType.Number>
>(settings: Partial<S>): TemplateSlotNumericValuatorSettings {
    return {
        isIntegerValue: false,
        integerBase: 10,

        ...deriveTemplateSlotValuatorSettingsFromDefaults(settings)
    };
}

export class TemplateSlotNumericValuator extends TemplateSlotValuator<
    TemplateSlotValueType.Number,
    TemplateSlotNumericValuatorSettings
> {
    readonly type = TemplateSlotValueType.Number;

    constructor(slot: TemplateSlot, partialSettings: Partial<TemplateSlotNumericValuatorSettings> = {}) {
        super(
            slot,
            partialSettings,
            deriveTemplateSlotNumericValuatorSettingsFromDefaults
        );
    }

    convertTextToValue(text: string): number {
        return this.settings.isIntegerValue
            ? parseInt(text, this.settings.integerBase)
            : parseFloat(text);
    }

    convertValueToText(newValue: number): string {
        return this.settings.isIntegerValue
            ? newValue.toString(this.settings.integerBase)
            : newValue.toString();
    }

    static makeProvider(partialSettings: Partial<TemplateSlotNumericValuatorSettings> = {}): TemplateSlotValuatorProvider {
        return {
            provideValuatorForSlot: (slot: TemplateSlot) => new TemplateSlotNumericValuator(slot, partialSettings)
        };
    }
}