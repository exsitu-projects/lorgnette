import { TreePatternFinder } from "../../core/fragments/syntactic/TreePatternFinder";
import { SyntaxTreePattern } from "../../core/languages/SyntaxTreePattern";
import { ProgrammableBackwardMapping } from "../../core/mappings/ProgrammableBackwardMapping";
import { ProjectionSpecification } from "../../core/projections/ProjectionSpecification";
import { SyntacticFragment } from "../../core/fragments/syntactic/SyntacticFragment";
import { ProgrammableForwardMapping } from "../../core/mappings/ProgrammableForwardMapping";

const forwardMapping = new ProgrammableForwardMapping<SyntacticFragment>(({ fragment }) => {
    const regexAsString = fragment.text;
    const lastRegexLiteralSlashIndex = regexAsString.lastIndexOf("/");
    
    const regexBody = regexAsString.slice(1, lastRegexLiteralSlashIndex);
    const regexFlags = regexAsString.slice(lastRegexLiteralSlashIndex + 1);
    
    try {
        return {
            regex: new RegExp(regexBody, regexFlags),
            range: fragment.range
        };
    }
    catch (error) {
        console.error("Error while constructing a regex:", error);
        return { regex: new RegExp("") };
    }
});

const backwardMapping = new ProgrammableBackwardMapping<SyntacticFragment>(({ userInterfaceOutput, documentEditor, fragment  }) => {
    const regex = userInterfaceOutput.regex;
    
    const regexRange = fragment.node.range;
    documentEditor.replace(regexRange, regex.toString());
    documentEditor.applyEdits();
});

export const regexLiteralDiagramSpecification: ProjectionSpecification<SyntacticFragment> = {
    name: "Regex literal diagram",

    requirements: { languages: ["typescript"] },

    pattern: new TreePatternFinder(new SyntaxTreePattern(n => n.type === "RegularExpressionLiteral")),

    forwardMapping: forwardMapping,

    backwardMapping: backwardMapping,

    userInterface: "regex-editor",
    
    renderer: {
        name: "button-popup",
        settings: { buttonContent: "📊" }
    }
};
