import { Position } from "../core/documents/Position";
import { Range } from "../core/documents/Range";
import { ProgrammableInputMapping } from "../core/mappings/ProgrammableInputMapping";
import { ProgrammableOutputMapping } from "../core/mappings/ProgrammableOutputMapping";
import { AsideRenderer } from "../core/renderers/aside/AsideRenderer";
import { ColorPicker } from "../core/user-interfaces/color-picker/ColorPicker";
import { TextualMonocleProvider } from "../core/monocles/textual/TextualMonocleProvider";
import { RegexPatternFinder } from "../core/patterns/textual/RegexPatternFinder";
import { TemplateSlotNumericValuator } from "../core/templates/TemplateSlotValuator";

const HEXADECIMAL_COLOR_STRING_RGB_RANGES = {
    r: new Range(new Position(1, 0, 1), new Position(3, 0, 3)),
    g: new Range(new Position(3, 0, 3), new Position(5, 0, 5)),
    b: new Range(new Position(5, 0, 5), new Position(7, 0, 7))
};

export const hexadecimalColorPickerProvider = new TextualMonocleProvider({
    name: "Hexadecimal color code",

    usageRequirements: {},

    fragmentProvider: new RegexPatternFinder("#([a-fA-F0-9]{6})"),

    inputMapping: new ProgrammableInputMapping(({ fragment }) => {
        const hexadecimalColorString = fragment.text;

        return {
            color: {
                r: parseInt(hexadecimalColorString.substring(1, 3), 16),
                g: parseInt(hexadecimalColorString.substring(3, 5), 16),
                b: parseInt(hexadecimalColorString.substring(5, 7), 16)
            }
        };
    }),

    outputMapping: new ProgrammableOutputMapping(({ output, documentEditor, fragment }) => {
        const adaptRange = (range: Range) => range.relativeTo(fragment.range.start);
        const hexOfRgbValue = (n: number) => n.toString(16);
        
        documentEditor.replace(adaptRange(HEXADECIMAL_COLOR_STRING_RGB_RANGES.r), hexOfRgbValue(output.color.r));
        documentEditor.replace(adaptRange(HEXADECIMAL_COLOR_STRING_RGB_RANGES.g), hexOfRgbValue(output.color.g));
        documentEditor.replace(adaptRange(HEXADECIMAL_COLOR_STRING_RGB_RANGES.b), hexOfRgbValue(output.color.b));
        
        documentEditor.applyEdits();
    }),

    userInterfaceProvider: ColorPicker.makeProvider(),
    
    rendererProvider: AsideRenderer.makeProvider({
        onlyShowWhenCursorIsInRange: true
    })
});
