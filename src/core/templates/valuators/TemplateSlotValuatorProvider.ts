import { TemplateSlot } from "../TemplateSlot";
import { TemplateSlotValuator } from "./TemplateSlotValuator";

export interface TemplateSlotValuatorProvider {
    provideValuatorForSlot(slot: TemplateSlot): TemplateSlotValuator
};
