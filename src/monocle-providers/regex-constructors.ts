import { TreePatternFinder } from "../core/fragments/syntactic/TreePatternFinder";
import { SyntaxTreePattern, SKIP_MATCH_DESCENDANTS } from "../core/languages/SyntaxTreePattern";
import { ProgrammableInputMapping } from "../core/mappings/ProgrammableInputMapping";
import { ProgrammableOutputMapping } from "../core/mappings/ProgrammableOutputMapping";
import { ButtonPopupRenderer } from "../core/renderers/popup/ButtonPopupRenderer";
import { RegexEditor } from "../core/user-interfaces/regex-editor/RegexEditor";
import { SyntacticMonocleProvider } from "../core/visualisations/syntactic/SyntacticMonocleProvider";

export const regexConstructorVisualisationProvider = new SyntacticMonocleProvider({
    name: "Regulax expressions (constructor)",

    usageRequirements: { languages: ["typescript"] },

    fragmentProvider: new TreePatternFinder(new SyntaxTreePattern(n => 
        n.type === "NewExpression"
            && n.childNodes[1].parserNode.escapedText === "RegExp"
            && n.childNodes[3].childNodes[0].type === "StringLiteral",
        SKIP_MATCH_DESCENDANTS
    )),

    inputMapping: new ProgrammableInputMapping(({ document, fragment }) => {
        const regexBodyRange = fragment.node.childNodes[3].childNodes[0].range;
        const hasLiteralRegexFlags = fragment.node.childNodes[3].childNodes[2]?.type === "StringLiteral";
        const regexFlagsRange = hasLiteralRegexFlags
        ? fragment.node.childNodes[3].childNodes[2].range
        : undefined;
        
        const regexBodyWithQuotes = document.getContentInRange(regexBodyRange);
        const regexFlagsWithQuotes = regexFlagsRange
        ? document.getContentInRange(regexFlagsRange)
        : "";
        
        const regexBody = regexBodyWithQuotes.slice(1, regexBodyWithQuotes.length - 1);
        const regexFlags = regexFlagsWithQuotes.slice(1, regexFlagsWithQuotes.length - 1);
        
        try {
            return {
                regex: new RegExp(regexBody, regexFlags),
                range: fragment.node.childNodes[3].range
            
            };
        }
        catch (error) {
            console.error("Error while constructing a regex:", error);
            return { regex: new RegExp("") };
        }
    }),

    outputMapping: new ProgrammableOutputMapping(({ output, documentEditor, fragment }) => {
        const regex = output.regex;
        
        // Extract the body and the flags of the regex
        const regexAsString = regex.toString() as string;
        const lastRegexSlashIndex = regexAsString.lastIndexOf("/");
        
        const regexBody = regexAsString.slice(1, lastRegexSlashIndex);
        const regexFlags = regexAsString.slice(lastRegexSlashIndex + 1);
        const hasRegexFlags = regexFlags.length > 0;
        
        // Replace the arguments with the new body and flags (if any)
        const regexArgumentsRange = fragment.node.childNodes[3].range;
        const newRegexArguments = hasRegexFlags
        ? `"${regexBody}", "${regexFlags}"`
        : `"${regexBody}"`;
        
        documentEditor.replace(regexArgumentsRange, newRegexArguments);
        documentEditor.applyEdits();
    }),

    userInterfaceProvider: RegexEditor.makeProvider(),
    
    rendererProvider: ButtonPopupRenderer.makeProvider()
});
