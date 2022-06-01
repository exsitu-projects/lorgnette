import { SyntacticPatternFinder } from "../core/code-patterns/syntactic/SyntacticPatternFinder";
import { RegexPatternFinder } from "../core/code-patterns/textual/RegexPatternFinder";
import { Range } from "../core/documents/Range";
import { SyntaxTreePattern, SKIP_MATCH_DESCENDANTS } from "../core/languages/SyntaxTreePattern";
import { ProgrammableInputMapping } from "../core/mappings/ProgrammableInputMapping";
import { ProgrammableOutputMapping } from "../core/mappings/ProgrammableOutputMapping";
import { AsideRenderer } from "../core/renderers/aside/AsideRenderer";
import { ProgrammableSiteProvider } from "../core/sites/syntactic/ProgrammableSiteProvider";
import { RegexSiteProvider } from "../core/sites/textual/RegexSiteProvider";
import { ColorPicker } from "../core/user-interfaces/color-picker/ColorPicker";
import { SyntacticCodeVisualisationProvider } from "../core/visualisations/syntactic/SyntacticCodeVisualisationProvider";
import { TextualCodeVisualisationProvider } from "../core/visualisations/textual/TextualCodeVisualisationProvider";

export const textualRgbColorConstructorVisualisationProvider = new TextualCodeVisualisationProvider(
    "RGB Color constructor",
    { languages: ["typescript"] },
    new RegexPatternFinder("Color\\((\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\)"),
    [
        // (?<=) is a non-capturing lookbehind; (?=) is a non-capturing lookahead.
        new RegexSiteProvider("(?<=Color\\()(\\d+)"),
        new RegexSiteProvider("(?<=Color\\([^,]+,\\s*)(\\d+)"),
        new RegexSiteProvider("(?<=Color\\([^,]+,[^,]+,\\s*)(\\d+)"),
    ],
    new ProgrammableInputMapping(arg => {
        return {
            r: parseInt(arg.sites[0].text),
            g: parseInt(arg.sites[1].text),
            b: parseInt(arg.sites[2].text)
        };
    }),
    new ProgrammableOutputMapping(arg => {
        const data = arg.output.data;
        const documentEditor = arg.output.editor;
        const pattern = arg.pattern;
        const sites = arg.sites;
        
        const adaptSiteRange = (range: Range) => range.relativeTo(pattern.range.start);
        
        documentEditor.replace(adaptSiteRange(sites[0].range), data.r.toString());
        documentEditor.replace(adaptSiteRange(sites[1].range) ,data.g.toString());
        documentEditor.replace(adaptSiteRange(sites[2].range), data.b.toString());
        
        documentEditor.applyEdits();
    }),
    ColorPicker.makeProvider(),
    AsideRenderer.makeProvider({
        onlyShowWhenCursorIsInRange: true
    })
);





export const syntacticRgbColorConstructorVisualisationProvider = new SyntacticCodeVisualisationProvider(
    "RGB Color constructor — Syntactic",
    { languages: ["typescript"] },
    new SyntacticPatternFinder(new SyntaxTreePattern(n => 
        n.type === "NewExpression"
            && n.childNodes[1].parserNode.escapedText === "Color"
            && n.childNodes[3].childNodes.filter(c => c.type === "FirstLiteralToken").length === 3,
        SKIP_MATCH_DESCENDANTS
    )),
    [
        new ProgrammableSiteProvider(p => p.node.childNodes[3].childNodes.filter(c => c.type === "FirstLiteralToken")[0]),
        new ProgrammableSiteProvider(p => p.node.childNodes[3].childNodes.filter(c => c.type === "FirstLiteralToken")[1]),
        new ProgrammableSiteProvider(p => p.node.childNodes[3].childNodes.filter(c => c.type === "FirstLiteralToken")[2])
    ],
    new ProgrammableInputMapping(arg => {
        const sites = arg.sites;
        
        return {
            r: parseInt(sites[0].text),
            g: parseInt(sites[1].text),
            b: parseInt(sites[2].text)
        };
    }),
    new ProgrammableOutputMapping(arg => {
        const data = arg.output.data;
        const documentEditor = arg.output.editor;
        const sites = arg.sites;
        
        documentEditor.replace(sites[0].range, data.r.toString());
        documentEditor.replace(sites[1].range ,data.g.toString());
        documentEditor.replace(sites[2].range, data.b.toString());
        
        documentEditor.applyEdits();
    }),
    ColorPicker.makeProvider(),
    AsideRenderer.makeProvider({
        onlyShowWhenCursorIsInRange: true
    })
);
