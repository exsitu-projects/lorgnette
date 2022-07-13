import { RegexPatternFinder } from "../core/code-patterns/textual/RegexPatternFinder";
import { TextualPattern } from "../core/code-patterns/textual/TextualPattern";
import { Position } from "../core/documents/Position";
import { Range } from "../core/documents/Range";
import { ProgrammableInputMapping } from "../core/mappings/ProgrammableInputMapping";
import { ProgrammableOutputMapping } from "../core/mappings/ProgrammableOutputMapping";
import { AsideRenderer } from "../core/renderers/aside/AsideRenderer";
import { ColorPicker } from "../core/user-interfaces/color-picker/ColorPicker";
import { TextualCodeVisualisationProvider } from "../core/visualisations/textual/TextualCodeVisualisationProvider";

const HEXADECIMAL_COLOR_STRING_RGB_RANGES = {
    r: new Range(new Position(1, 0, 1), new Position(3, 0, 3)),
    g: new Range(new Position(3, 0, 3), new Position(5, 0, 5)),
    b: new Range(new Position(5, 0, 5), new Position(7, 0, 7))
};

export const hexadecimalColorCodeVisualisationProvider = new TextualCodeVisualisationProvider(
    "Hexadecimal color code",
    {},
    new RegexPatternFinder("#([a-fA-F0-9]{6})"),
    new ProgrammableInputMapping(arg => {
        const pattern = (arg.pattern as TextualPattern);
        const hexadecimalColorString = pattern.text;

        return {
            r: parseInt(hexadecimalColorString.substring(1, 3), 16),
            g: parseInt(hexadecimalColorString.substring(3, 5), 16),
            b: parseInt(hexadecimalColorString.substring(5, 7), 16)
        };
    }),
    new ProgrammableOutputMapping(arg => {
        const data = arg.output.data;
        const editor = arg.output.editor;
        const pattern = arg.pattern;

        const adaptRange = (range: Range) => range.relativeTo(pattern.range.start);
        const hexOfRgbValue = (n: number) => n.toString(16);
        
        editor.replace(adaptRange(HEXADECIMAL_COLOR_STRING_RGB_RANGES.r), hexOfRgbValue(data.r));
        editor.replace(adaptRange(HEXADECIMAL_COLOR_STRING_RGB_RANGES.g), hexOfRgbValue(data.g));
        editor.replace(adaptRange(HEXADECIMAL_COLOR_STRING_RGB_RANGES.b), hexOfRgbValue(data.b));
        
        editor.applyEdits();
    }),
    ColorPicker.makeProvider(),
    AsideRenderer.makeProvider({
        onlyShowWhenCursorIsInRange: true
    })
);
