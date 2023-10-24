import { SyntacticFragment } from "../../core/fragments/syntactic/SyntacticFragment";
import { TreePatternFinder } from "../../core/fragments/syntactic/TreePatternFinder";
import { RegexPatternFinder } from "../../core/fragments/textual/RegexPatternFinder";
import { TextualFragment } from "../../core/fragments/textual/TextualFragment";
import { Range } from "../../core/documents/Range";
import { SyntaxTreePattern, SKIP_MATCH_DESCENDANTS } from "../../core/languages/SyntaxTreePattern";
import { TypescriptSyntaxTreeNode } from "../languages/typescript/TypescriptSyntaxTreeNode";
import { ProgrammableBackwardMapping } from "../../core/mappings/ProgrammableBackwardMapping";
import { RegexMatcher, RegexMatch } from "../../utilities/RegexMatcher"
import { ProjectionSpecification } from "../../core/projections/ProjectionSpecification";
import { ProgrammableForwardMapping } from "../../core/mappings/ProgrammableForwardMapping";

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

export const textualRgbConstructorColorPickerSpecification: ProjectionSpecification<TextualFragment> = {
    name: "RGB color constructor (textual)",

    requirements: { languages: ["typescript"] },

    pattern: new RegexPatternFinder("Color\\((\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\)"),

    forwardMapping: new ProgrammableForwardMapping<TextualFragment>(({ fragment }) => {
        const rgbRegexMatches = getTextualColorConstructorRgbRegexMatches(fragment);
        return {
            color: {
                r: parseInt(rgbRegexMatches.r.value),
                g: parseInt(rgbRegexMatches.g.value),
                b: parseInt(rgbRegexMatches.b.value)
            }
        };
    }),

    backwardMapping: new ProgrammableBackwardMapping<TextualFragment>(({ userInterfaceOutput, documentEditor, fragment }) => {
        const rgbRegexMatches = getTextualColorConstructorRgbRegexMatches(fragment);
        
        const adaptRange = (range: Range) => range.relativeTo(fragment.range.start);
        
        documentEditor.replace(adaptRange(rgbRegexMatches.r.range), userInterfaceOutput.color.r.toString());
        documentEditor.replace(adaptRange(rgbRegexMatches.g.range) ,userInterfaceOutput.color.g.toString());
        documentEditor.replace(adaptRange(rgbRegexMatches.b.range), userInterfaceOutput.color.b.toString());
        
        documentEditor.applyEdits();
    }),

    userInterface: "color-picker",
    
    renderer: {
        name: "side",
        settings: {
            onlyShowWhenCursorIsInRange: true
        }
    }
};





// Syntactic version.

type RgbTypescriptNodes = { r: TypescriptSyntaxTreeNode, g: TypescriptSyntaxTreeNode, b: TypescriptSyntaxTreeNode };

function getSyntacticColorConstructorRgbNodes(fragment: SyntacticFragment): RgbTypescriptNodes {
    return {
        r: fragment.node.childNodes[3].childNodes.filter(c => c.type === "FirstLiteralToken")[0] as TypescriptSyntaxTreeNode,
        g: fragment.node.childNodes[3].childNodes.filter(c => c.type === "FirstLiteralToken")[1] as TypescriptSyntaxTreeNode,
        b: fragment.node.childNodes[3].childNodes.filter(c => c.type === "FirstLiteralToken")[2] as TypescriptSyntaxTreeNode
    }
}

export const syntacticRgbConstructorColorPickerSpecification: ProjectionSpecification<SyntacticFragment> = {
    name: "RGB color constructor (syntactic)",

    requirements: { languages: ["typescript"] },

    pattern: new TreePatternFinder(new SyntaxTreePattern(n => 
        n.type === "NewExpression"
            && n.childNodes[1].parserNode.escapedText === "Color"
            && n.childNodes[3].childNodes.filter(c => c.type === "FirstLiteralToken").length === 3,
        SKIP_MATCH_DESCENDANTS
    )),

    forwardMapping: new ProgrammableForwardMapping<SyntacticFragment>(({ fragment }) => {
        const rgbNodes = getSyntacticColorConstructorRgbNodes(fragment);
        return {
            color: {
                r: parseInt(rgbNodes.r.text),
                g: parseInt(rgbNodes.g.text),
                b: parseInt(rgbNodes.b.text)
            }
        };
    }),

    backwardMapping: new ProgrammableBackwardMapping<SyntacticFragment>(({ userInterfaceOutput, documentEditor, fragment }) => {
        const rgbNodes = getSyntacticColorConstructorRgbNodes(fragment);
        
        documentEditor.replace(rgbNodes.r.range, userInterfaceOutput.color.r.toString());
        documentEditor.replace(rgbNodes.g.range ,userInterfaceOutput.color.g.toString());
        documentEditor.replace(rgbNodes.b.range, userInterfaceOutput.color.b.toString());
        
        documentEditor.applyEdits();
    }),

    userInterface: "color-picker",
    
    renderer: {
        name: "side",
        settings: {
            onlyShowWhenCursorIsInRange: true
        }
    }
};
