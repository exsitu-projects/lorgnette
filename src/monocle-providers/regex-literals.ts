import { SyntacticPatternFinder } from "../core/code-patterns/syntactic/SyntacticPatternFinder";
import { SyntaxTreePattern } from "../core/languages/SyntaxTreePattern";
import { ProgrammableInputMapping } from "../core/mappings/ProgrammableInputMapping";
import { ProgrammableOutputMapping } from "../core/mappings/ProgrammableOutputMapping";
import { ButtonPopupRenderer } from "../core/renderers/popup/ButtonPopupRenderer";
import { RegexEditor } from "../core/user-interfaces/regex-editor/RegexEditor";
import { SyntacticMonocleProvider } from "../core/visualisations/syntactic/SyntacticMonocleProvider";

export const regexLiteralMonocleProvider = new SyntacticMonocleProvider({
    name: "Regulax expressions (literal)",

    usageRequirements: { languages: ["typescript"] },

    patternFinder: new SyntacticPatternFinder(new SyntaxTreePattern(n => n.type === "RegularExpressionLiteral")),

    inputMapping: new ProgrammableInputMapping(({ pattern }) => {
        const regexAsString = pattern.text;
        const lastRegexLiteralSlashIndex = regexAsString.lastIndexOf("/");
        
        const regexBody = regexAsString.slice(1, lastRegexLiteralSlashIndex);
        const regexFlags = regexAsString.slice(lastRegexLiteralSlashIndex + 1);
        
        try {
            return {
                regex: new RegExp(regexBody, regexFlags),
                range: pattern.range
            };
        }
        catch (error) {
            console.error("Error while constructing a regex:", error);
            return { regex: new RegExp("") };
        }
    }),

    outputMapping: new ProgrammableOutputMapping(({ output, documentEditor, pattern }) => {
        const regex = output.regex;
        
        const regexRange = pattern.node.range;
        documentEditor.replace(regexRange, regex.toString());
        documentEditor.applyEdits();
    }),

    userInterfaceProvider: RegexEditor.makeProvider(),
    
    rendererProvider: ButtonPopupRenderer.makeProvider()
});
