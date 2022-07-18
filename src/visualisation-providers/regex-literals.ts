import { SyntacticPattern } from "../core/code-patterns/syntactic/SyntacticPattern";
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

    inputMapping: new ProgrammableInputMapping(arg => {
        const regexAsString = arg.pattern.text;
        const lastRegexLiteralSlashIndex = regexAsString.lastIndexOf("/");
        
        const regexBody = regexAsString.slice(1, lastRegexLiteralSlashIndex);
        const regexFlags = regexAsString.slice(lastRegexLiteralSlashIndex + 1);
        
        try {
            return {
                regex: new RegExp(regexBody, regexFlags),
                range: arg.pattern.range
            };
        }
        catch (error) {
            console.error("Error while constructing a regex:", error);
            return { regex: new RegExp("") };
        }
    }),

    outputMapping: new ProgrammableOutputMapping(arg => {
        const regex = arg.output.data.regex;
        const editor = arg.output.editor;
        const pattern = arg.pattern as SyntacticPattern;
        
        const regexRange = pattern.node.range;
        editor.replace(regexRange, regex.toString());
        editor.applyEdits();
    }),

    userInterfaceProvider: RegexEditor.makeProvider(),
    
    rendererProvider: ButtonPopupRenderer.makeProvider()
});
