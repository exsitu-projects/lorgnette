import { RegexPatternFinder } from "../core/code-patterns/textual/RegexPatternFinder";
import { Range } from "../core/documents/Range";
import { ProgrammableInputMapping } from "../core/mappings/ProgrammableInputMapping";
import { ProgrammableOutputMapping } from "../core/mappings/ProgrammableOutputMapping";
import { AsideRenderer } from "../core/renderers/aside/AsideRenderer";
import { RangeSiteProvider } from "../core/sites/textual/RangeSiteProvider";
import { ColorPicker } from "../core/user-interfaces/color-picker/ColorPicker";
import { TextualCodeVisualisationProvider } from "../core/visualisations/textual/TextualCodeVisualisationProvider";

export const hexadecimalColorCodeVisualisationProvider = new TextualCodeVisualisationProvider(
    "Hexadecimal color code",
    {},
    new RegexPatternFinder("=([a-fA-F0-9]{6})"),
    [
        new RangeSiteProvider(1, 2),
        new RangeSiteProvider(3, 4),
        new RangeSiteProvider(5, 6),
    ],
    new ProgrammableInputMapping(arg => {
        return {
            r: parseInt(arg.sites[0].text, 16),
            g: parseInt(arg.sites[1].text, 16),
            b: parseInt(arg.sites[2].text, 16)
        };
    }),
    new ProgrammableOutputMapping(arg => {
        const data = arg.output.data;
        const editor = arg.output.editor;
        const pattern = arg.pattern;
        const sites = arg.sites;
        
        const adaptSiteRange = (range: Range) => range.relativeTo(pattern.range.start);
        const hexOfRgbValue = (n: number) => n.toString(16);
        
        editor.replace(adaptSiteRange(sites[0].range), hexOfRgbValue(data.r));
        editor.replace(adaptSiteRange(sites[1].range), hexOfRgbValue(data.g));
        editor.replace(adaptSiteRange(sites[2].range), hexOfRgbValue(data.b));
        
        editor.applyEdits();
    }),
    ColorPicker.makeProvider(),
    AsideRenderer.makeProvider({
        // onlyShowWhenCursorIsInRange: true
    })
);
