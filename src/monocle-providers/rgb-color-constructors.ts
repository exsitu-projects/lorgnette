import { SyntacticFragment } from "../core/fragments/syntactic/SyntacticFragment";
import { TreePatternFinder } from "../core/fragments/syntactic/TreePatternFinder";
import { RegexPatternFinder } from "../core/fragments/textual/RegexPatternFinder";
import { TextualFragment } from "../core/fragments/textual/TextualFragment";
import { Range } from "../core/documents/Range";
import { SyntaxTreePattern, SKIP_MATCH_DESCENDANTS } from "../core/languages/SyntaxTreePattern";
import { TypescriptSyntaxTreeNode } from "../core/languages/typescript/TypescriptSyntaxTreeNode";
import { ProgrammableInputMapping } from "../core/mappings/ProgrammableInputMapping";
import { ProgrammableOutputMapping } from "../core/mappings/ProgrammableOutputMapping";
import { AsideRenderer } from "../core/renderers/aside/AsideRenderer";
import { ColorPicker } from "../core/user-interfaces/color-picker/ColorPicker";
import { SyntacticMonocleProvider } from "../core/monocles/syntactic/SyntacticMonocleProvider";
import { TextualMonocleProvider } from "../core/monocles/textual/TextualMonocleProvider";
import { RegexMatcher, RegexMatch } from "../utilities/RegexMatcher"

// Textual version.

type RgbRegexMatches = { r: RegexMatch, g: RegexMatch, b: RegexMatch };

// (?<=) is a non-capturing lookbehind; (?=) is a non-capturing lookahead.
const redRegexMatcher = new RegexMatcher("(?<=Color\\()(\\d+)");
const greenRegexMatcher = new RegexMatcher("(?<=Color\\([^,]+,\\s*)(\\d+)");
const blueRegexMatcher = new RegexMatcher("(?<=Color\\([^,]+,[^,]+,\\s*)(\\d+)");

function getTextualColorConstructorRgbRegexMatches(fragment: TextualFragment): RgbRegexMatches {
    const text = fragment.text;
    return {
        r: redRegexMatcher.match(text)!,
        g: greenRegexMatcher.match(text)!,
        b: blueRegexMatcher.match(text)!,
    }
}

export const textualRgbConstructorColorPickerProvider = new TextualMonocleProvider({
    name: "RGB Color constructor (textual)",

    usageRequirements: { languages: ["typescript"] },

    fragmentProvider: new RegexPatternFinder("Color\\((\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\)"),

    inputMapping: new ProgrammableInputMapping(({ fragment }) => {
        const rgbRegexMatches = getTextualColorConstructorRgbRegexMatches(fragment);
        return {
            color: {
                r: parseInt(rgbRegexMatches.r.value),
                g: parseInt(rgbRegexMatches.g.value),
                b: parseInt(rgbRegexMatches.b.value)
            }
        };
    }),

    outputMapping: new ProgrammableOutputMapping(({ output, documentEditor, fragment }) => {
        const rgbRegexMatches = getTextualColorConstructorRgbRegexMatches(fragment);
        
        const adaptRange = (range: Range) => range.relativeTo(fragment.range.start);
        
        documentEditor.replace(adaptRange(rgbRegexMatches.r.range), output.color.r.toString());
        documentEditor.replace(adaptRange(rgbRegexMatches.g.range) ,output.color.g.toString());
        documentEditor.replace(adaptRange(rgbRegexMatches.b.range), output.color.b.toString());
        
        documentEditor.applyEdits();
    }),

    userInterfaceProvider: ColorPicker.makeProvider(),
    
    rendererProvider: AsideRenderer.makeProvider({
        onlyShowWhenCursorIsInRange: true
    })
});





// Syntactic version.

type RgbTypescriptNodes = { r: TypescriptSyntaxTreeNode, g: TypescriptSyntaxTreeNode, b: TypescriptSyntaxTreeNode };

function getSyntacticColorConstructorRgbNodes(fragment: SyntacticFragment): RgbTypescriptNodes {
    return {
        r: fragment.node.childNodes[3].childNodes.filter(c => c.type === "FirstLiteralToken")[0] as TypescriptSyntaxTreeNode,
        g: fragment.node.childNodes[3].childNodes.filter(c => c.type === "FirstLiteralToken")[1] as TypescriptSyntaxTreeNode,
        b: fragment.node.childNodes[3].childNodes.filter(c => c.type === "FirstLiteralToken")[2] as TypescriptSyntaxTreeNode
    }
}

export const syntacticRgbConstructorColorPickerProvider = new SyntacticMonocleProvider({
    name: "RGB Color constructor (syntactic)",

    usageRequirements: { languages: ["typescript"] },

    fragmentProvider: new TreePatternFinder(new SyntaxTreePattern(n => 
        n.type === "NewExpression"
            && n.childNodes[1].parserNode.escapedText === "Color"
            && n.childNodes[3].childNodes.filter(c => c.type === "FirstLiteralToken").length === 3,
        SKIP_MATCH_DESCENDANTS
    )),

    inputMapping: new ProgrammableInputMapping(({ fragment }) => {
        const rgbNodes = getSyntacticColorConstructorRgbNodes(fragment);
        return {
            color: {
                r: parseInt(rgbNodes.r.text),
                g: parseInt(rgbNodes.g.text),
                b: parseInt(rgbNodes.b.text)
            }
        };
    }),

    outputMapping: new ProgrammableOutputMapping(({ output, documentEditor, fragment }) => {
        const rgbNodes = getSyntacticColorConstructorRgbNodes(fragment);
        
        documentEditor.replace(rgbNodes.r.range, output.color.r.toString());
        documentEditor.replace(rgbNodes.g.range ,output.color.g.toString());
        documentEditor.replace(rgbNodes.b.range, output.color.b.toString());
        
        documentEditor.applyEdits();
    }),

    userInterfaceProvider: ColorPicker.makeProvider(),
    
    rendererProvider: AsideRenderer.makeProvider({
        onlyShowWhenCursorIsInRange: true
    })
});
