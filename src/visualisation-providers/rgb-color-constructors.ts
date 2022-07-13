import { SyntacticPattern } from "../core/code-patterns/syntactic/SyntacticPattern";
import { SyntacticPatternFinder } from "../core/code-patterns/syntactic/SyntacticPatternFinder";
import { RegexPatternFinder } from "../core/code-patterns/textual/RegexPatternFinder";
import { TextualPattern } from "../core/code-patterns/textual/TextualPattern";
import { Range } from "../core/documents/Range";
import { SyntaxTreePattern, SKIP_MATCH_DESCENDANTS } from "../core/languages/SyntaxTreePattern";
import { TypescriptSyntaxTreeNode } from "../core/languages/typescript/TypescriptSyntaxTreeNode";
import { ProgrammableInputMapping } from "../core/mappings/ProgrammableInputMapping";
import { ProgrammableOutputMapping } from "../core/mappings/ProgrammableOutputMapping";
import { AsideRenderer } from "../core/renderers/aside/AsideRenderer";
import { ColorPicker } from "../core/user-interfaces/color-picker/ColorPicker";
import { SyntacticCodeVisualisationProvider } from "../core/visualisations/syntactic/SyntacticCodeVisualisationProvider";
import { TextualCodeVisualisationProvider } from "../core/visualisations/textual/TextualCodeVisualisationProvider";
import { RegexMatcher, RegexMatch } from "../utilities/RegexMatcher"

type RgbRegexMatches = { r: RegexMatch, g: RegexMatch, b: RegexMatch };

// (?<=) is a non-capturing lookbehind; (?=) is a non-capturing lookahead.
const redRegexMatcher = new RegexMatcher("(?<=Color\\()(\\d+)");
const greenRegexMatcher = new RegexMatcher("(?<=Color\\([^,]+,\\s*)(\\d+)");
const blueRegexMatcher = new RegexMatcher("(?<=Color\\([^,]+,[^,]+,\\s*)(\\d+)");

function getTextualColorConstructorRgbRegexMatches(pattern: TextualPattern): RgbRegexMatches {
    const text = pattern.text;
    return {
        r: redRegexMatcher.match(text)!,
        g: greenRegexMatcher.match(text)!,
        b: blueRegexMatcher.match(text)!,
    }
}

export const textualRgbColorConstructorVisualisationProvider = new TextualCodeVisualisationProvider(
    "RGB Color constructor",
    { languages: ["typescript"] },
    new RegexPatternFinder("Color\\((\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\)"),
    new ProgrammableInputMapping(arg => {
        const rgbRegexMatches = getTextualColorConstructorRgbRegexMatches(arg.pattern as TextualPattern);
        return {
            r: parseInt(rgbRegexMatches.r.value),
            g: parseInt(rgbRegexMatches.g.value),
            b: parseInt(rgbRegexMatches.b.value)
        };
    }),
    new ProgrammableOutputMapping(arg => {
        const data = arg.output.data;
        const documentEditor = arg.output.editor;
        const pattern = arg.pattern;
        const rgbRegexMatches = getTextualColorConstructorRgbRegexMatches(arg.pattern as TextualPattern);
        
        const adaptRange = (range: Range) => range.relativeTo(pattern.range.start);
        
        documentEditor.replace(adaptRange(rgbRegexMatches.r.range), data.r.toString());
        documentEditor.replace(adaptRange(rgbRegexMatches.g.range) ,data.g.toString());
        documentEditor.replace(adaptRange(rgbRegexMatches.b.range), data.b.toString());
        
        documentEditor.applyEdits();
    }),
    ColorPicker.makeProvider(),
    AsideRenderer.makeProvider({
        onlyShowWhenCursorIsInRange: true
    })
);


type RgbTypescriptNodes = { r: TypescriptSyntaxTreeNode, g: TypescriptSyntaxTreeNode, b: TypescriptSyntaxTreeNode };

function getSyntacticColorConstructorRgbNodes(pattern: SyntacticPattern): RgbTypescriptNodes {
    return {
        r: pattern.node.childNodes[3].childNodes.filter(c => c.type === "FirstLiteralToken")[0] as TypescriptSyntaxTreeNode,
        g: pattern.node.childNodes[3].childNodes.filter(c => c.type === "FirstLiteralToken")[1] as TypescriptSyntaxTreeNode,
        b: pattern.node.childNodes[3].childNodes.filter(c => c.type === "FirstLiteralToken")[2] as TypescriptSyntaxTreeNode
    }
}

export const syntacticRgbColorConstructorVisualisationProvider = new SyntacticCodeVisualisationProvider(
    "RGB Color constructor — Syntactic",
    { languages: ["typescript"] },
    new SyntacticPatternFinder(new SyntaxTreePattern(n => 
        n.type === "NewExpression"
            && n.childNodes[1].parserNode.escapedText === "Color"
            && n.childNodes[3].childNodes.filter(c => c.type === "FirstLiteralToken").length === 3,
        SKIP_MATCH_DESCENDANTS
    )),
    new ProgrammableInputMapping(arg => {
        const rgbNodes = getSyntacticColorConstructorRgbNodes(arg.pattern as SyntacticPattern);
        return {
            r: parseInt(rgbNodes.r.text),
            g: parseInt(rgbNodes.g.text),
            b: parseInt(rgbNodes.b.text)
        };
    }),
    new ProgrammableOutputMapping(arg => {
        const data = arg.output.data;
        const documentEditor = arg.output.editor;

        const rgbNodes = getSyntacticColorConstructorRgbNodes(arg.pattern as SyntacticPattern);
        
        documentEditor.replace(rgbNodes.r.range, data.r.toString());
        documentEditor.replace(rgbNodes.g.range ,data.g.toString());
        documentEditor.replace(rgbNodes.b.range, data.b.toString());
        
        documentEditor.applyEdits();
    }),
    ColorPicker.makeProvider(),
    AsideRenderer.makeProvider({
        onlyShowWhenCursorIsInRange: true
    })
);
