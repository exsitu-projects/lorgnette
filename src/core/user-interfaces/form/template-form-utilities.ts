import { Color } from "../../../utilities/Color";
import { ValueCondition } from "../../../utilities/ValueCondition";
import { TemplateSettings } from "../../templates/Template";
import { TemplateSlotKey } from "../../templates/TemplateSlot";
import { BooleanValuator } from "../../templates/valuators/BooleanValuator";
import { NumericValuator } from "../../templates/valuators/NumericValuator";
import { TextualValuator } from "../../templates/valuators/TextualValuator";
import { ValuatorSettings, Valuator } from "../../templates/valuators/Valuator";
import { FormEntryType, FormEntryValueOfType } from "./FormEntry";

// Make valuators automatically wrap values into form entries.
function createValuatorSettings(key: string, type: FormEntryType): Partial<ValuatorSettings> {
    if (type === FormEntryType.Color) {
        return {
            transformGetterValue: colorAsText => {
                return { value: Color.fromCss(colorAsText), type, key };
            },
            transformSetterValue: (color: Color) => {
                return color.css;
            }
        };
    }

    return {
        transformGetterValue: value => {
            return { value, type, key };
        }
    };
}

function createValuator(key: string, type: FormEntryType): Valuator {
    const valuatorSettings = createValuatorSettings(key, type);
    switch (type) {
        case FormEntryType.Number:
            return new NumericValuator(valuatorSettings);
        case FormEntryType.Boolean:
            return new BooleanValuator(valuatorSettings);
        case FormEntryType.String:
        case FormEntryType.Color:
            return new TextualValuator(valuatorSettings);
    }
}

export function createSlotSpecification<T extends FormEntryType>(
    key: TemplateSlotKey,
    type: T,
    defaultValue?: ValueCondition<FormEntryValueOfType<T>>
) {
    return {
        key: key,
        valuator: createValuator(key, type),
        ...defaultValue !== undefined ? { defaultValue } : {}
    }
}

export const FORM_DATA_TEMPLATE_TRANSFORMERS: Partial<TemplateSettings> = {
    // Wrap the template data (key-value pairs) into a "data" field of an object,
    // as expected by the Form user interface.
    transformTemplateData: data => { return { data: [...Object.values(data)] }; },

    // Turn the array of "modified form data" into template data (an object with key-value pairs).
    transformUserInterfaceOutput: output => {
        console.log("output", output)
        return output.modifiedData.reduce(
            (keysToModifiedEntries: any, entry: any) => {
                return { ...keysToModifiedEntries, [entry.key]: entry.value  }
            },
            {}
        )
    },
};
