import { Fragment } from "../fragments/Fragment";
import { Template } from "./Template";
import { TemplateSlotKey } from "./TemplateSlot";
import { TemplateSlotValuatorProvider } from "./TemplateSlotValuator";

/**
 * A slot specification is an object whose keys are slot keys
 * and whose values are valuators for slots with matching keys.
 */
export type TemplateSlotSpecification = Record<TemplateSlotKey, TemplateSlotValuatorProvider>;

export interface TemplateProvider<F extends Fragment = Fragment> {
    provideTemplateSpecifiedBy(
        slotSpecification: TemplateSlotSpecification
    ): Promise<Template<F>>;
}
