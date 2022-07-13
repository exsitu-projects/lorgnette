import { SyntacticPattern } from "../core/code-patterns/syntactic/SyntacticPattern";
import { SyntacticPatternFinder } from "../core/code-patterns/syntactic/SyntacticPatternFinder";
import { SyntaxTreePattern, SKIP_MATCH_DESCENDANTS } from "../core/languages/SyntaxTreePattern";
import { ProgrammableInputMapping } from "../core/mappings/ProgrammableInputMapping";
import { ProgrammableOutputMapping } from "../core/mappings/ProgrammableOutputMapping";
import { ButtonPopupRenderer } from "../core/renderers/popup/ButtonPopupRenderer";
import { RegexEditor } from "../core/user-interfaces/regex-editor/RegexEditor";
import { SyntacticCodeVisualisationProvider } from "../core/visualisations/syntactic/SyntacticCodeVisualisationProvider";

export const regexConstructorVisualisationProvider = new SyntacticCodeVisualisationProvider(
    "Regulax expressions (constructor)",
    { languages: ["typescript"] },
    new SyntacticPatternFinder(new SyntaxTreePattern(n => 
        n.type === "NewExpression"
            && n.childNodes[1].parserNode.escapedText === "RegExp"
            && n.childNodes[3].childNodes[0].type === "StringLiteral",
        SKIP_MATCH_DESCENDANTS
    )),
    new ProgrammableInputMapping(arg => {
        const document = arg.document;
        const pattern = arg.pattern as SyntacticPattern;
        
        const regexBodyRange = pattern.node.childNodes[3].childNodes[0].range;
        const hasLiteralRegexFlags = pattern.node.childNodes[3].childNodes[2]?.type === "StringLiteral";
        const regexFlagsRange = hasLiteralRegexFlags
        ? pattern.node.childNodes[3].childNodes[2].range
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
                range: pattern.node.childNodes[3].range
            
            };
        }
        catch (error) {
            console.error("Error while constructing a regex:", error);
            return { regex: new RegExp("") };
        }
    }),
    new ProgrammableOutputMapping(arg => {
        const regex = arg.output.data.regex;
        const editor = arg.output.editor;
        const pattern = arg.pattern as SyntacticPattern;
        
        // Extract the body and the flags of the regex
        const regexAsString = regex.toString() as string;
        const lastRegexSlashIndex = regexAsString.lastIndexOf("/");
        
        const regexBody = regexAsString.slice(1, lastRegexSlashIndex);
        const regexFlags = regexAsString.slice(lastRegexSlashIndex + 1);
        const hasRegexFlags = regexFlags.length > 0;
        
        // Replace the arguments with the new body and flags (if any)
        const regexArgumentsRange = pattern.node.childNodes[3].range;
        const newRegexArguments = hasRegexFlags
        ? `"${regexBody}", "${regexFlags}"`
        : `"${regexBody}"`;
        
        editor.replace(regexArgumentsRange, newRegexArguments);
        editor.applyEdits();
    }),
    RegexEditor.makeProvider(),
    ButtonPopupRenderer.makeProvider()
);
