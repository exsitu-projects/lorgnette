import React from "react";
import { TreePatternFinder } from "../core/fragments/syntactic/TreePatternFinder";
import { SyntaxTreePattern, SKIP_MATCH_DESCENDANTS } from "../core/languages/SyntaxTreePattern";
import { ProgrammableInputMapping } from "../core/mappings/ProgrammableInputMapping";
import { ProgrammableOutputMapping } from "../core/mappings/ProgrammableOutputMapping";
import { SyntacticMonocleProvider } from "../core/monocles/syntactic/SyntacticMonocleProvider";
import { AsideRenderer } from "../core/renderers/aside/AsideRenderer";
import { AsideRendererPosition } from "../core/renderers/aside/AsideRendererSettings";
import { Form } from "../core/user-interfaces/form/Form";
import { NumberInput } from "../core/user-interfaces/form/form-elements/NumberInput";
import { Select } from "../core/user-interfaces/form/form-elements/Select";
import { StringInput } from "../core/user-interfaces/form/form-elements/StringInput";
import { Switch } from "../core/user-interfaces/form/form-elements/Switch";
import { FormEntry, FormEntryType } from "../core/user-interfaces/form/FormEntry";

export const FormTestProvider = new SyntacticMonocleProvider({
    name: "Form test",

    usageRequirements: { languages: ["typescript"] },

    fragmentProvider: new TreePatternFinder(new SyntaxTreePattern(
        n => n.type === "ObjectLiteralExpression",
        SKIP_MATCH_DESCENDANTS
    )),

    inputMapping: new ProgrammableInputMapping(({ fragment, document }) => {
        const formEntries: FormEntry[] = [];

        // Get all the property assignments inside the object literal.
        const propertyAssignmentNodes = fragment.node.childNodes[1].childNodes.filter(node => node.type === "PropertyAssignment");

        // Create one form entry per property.
        for (let node of propertyAssignmentNodes) {
            const key = node.childNodes[0].getTextIn(document);
            const valueNode = node.childNodes[2];

            switch (valueNode.type) {
                case "FirstLiteralToken": // Number
                    formEntries.push({
                        type: FormEntryType.Number,
                        key: key,
                        value: Number(valueNode.getTextIn(document))
                    });
                    break;
                
                case "StringLiteral": // String
                    formEntries.push({
                        type: FormEntryType.String,
                        key: key,
                        value: valueNode.getTextIn(document).slice(1, -1)
                    });
                    break;
                
                case "TrueKeyword":
                case "FalseKeyword": // Boolean
                    formEntries.push({ 
                        type: FormEntryType.Boolean,
                        key: key,
                        value: valueNode.type === "TrueKeyword" ? true : false
                    });
                    break;
            }
        }

        return {
            data: formEntries
        };
    }),

    outputMapping: new ProgrammableOutputMapping(({ output, documentEditor, fragment }) => {
        // TODO
        console.log("Modified form entry:", output.modifiedData)
    }),

    userInterfaceProvider: Form.makeProvider(<>
        <h4 style={{ textAlign: "center" }}>Test form</h4>
        Some text introducing the purpose of this form and explaining some details.<br/>
        <NumberInput formEntryKey="a" label="Some number" />
        <StringInput formEntryKey="b" label="Some string" />
        Some text explaining the purpose of the next form element.<br/>
        <Switch formEntryKey="e" label="Some boolean" />
        <Select formEntryKey="d" items={["foo", "bar"]} />
        Some conclusive text...<br/>
    </>),
    
    rendererProvider: AsideRenderer.makeProvider({
        onlyShowWhenCursorIsInRange: true,
        position: AsideRendererPosition.RightSideOfCode
    })
});
