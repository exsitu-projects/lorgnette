import { TreePatternFinder } from "../../core/fragments/syntactic/TreePatternFinder";
import { SyntaxTreePattern, SKIP_MATCH_DESCENDANTS } from "../../core/languages/SyntaxTreePattern";
import { ProgrammableBackwardMapping } from "../../core/mappings/ProgrammableBackwardMapping";
import { SideRendererPosition } from "../renderers/side/SideRendererSettings";
import { BooleanEvaluator } from "../../core/templates/evaluators/boolean/BooleanEvaluator";
import { NumericEvaluator } from "../../core/templates/evaluators/numeric/NumericEvaluator";
import { Evaluator, EvaluatorSettings } from "../../core/templates/evaluators/Evaluator";
import { TextualEvaluator } from "../../core/templates/evaluators/textual/TextualEvaluator";
import { NumberInput } from "../user-interfaces/form/form-elements/NumberInput";
import { Select } from "../user-interfaces/form/form-elements/Select";
import { StringInput } from "../user-interfaces/form/form-elements/StringInput";
import { Switch } from "../user-interfaces/form/form-elements/Switch";
import { FormEntry, FormEntryType } from "../user-interfaces/form/FormEntry";
import { Button } from "../user-interfaces/form/form-elements/Button";
import { BLUE, Color, GREEN, RED } from "../../utilities/Color";
import { ButtonColorPicker } from "../user-interfaces/form/form-elements/ButtonColorPicker";
import { ButtonGroup } from "../user-interfaces/form/form-elements/helpers/ButtonGroup";
import { JavascriptLiteralObjectTemplate } from "../../utilities/languages/javascript/JavascriptLiteralObjectTemplate";
import { EditableText } from "../user-interfaces/form/form-elements/EditableText";
import { ProjectionSpecification } from "../../core/projections/ProjectionSpecification";
import { SyntacticFragment } from "../../core/fragments/syntactic/SyntacticFragment";
import { ProgrammableForwardMapping } from "../../core/mappings/ProgrammableForwardMapping";

export const testFormSpecification_1: ProjectionSpecification<SyntacticFragment> = {
    name: "Form test",

    requirements: { languages: ["typescript"] },

    pattern: new TreePatternFinder(new SyntaxTreePattern(
        n => n.type === "ObjectLiteralExpression",
        SKIP_MATCH_DESCENDANTS
    )),

    forwardMapping: new ProgrammableForwardMapping(({ fragment, document }) => {
        const formEntries: FormEntry[] = [];

        // Get all the property assignments inside the object literal.
        const propertyAssignmentNodes = fragment.node.childNodes[1].childNodes.filter(node => node.type === "PropertyAssignment");

        // Create one form entry per property.
        for (let node of propertyAssignmentNodes) {
            const key = node.childNodes[0].text;
            const valueNode = node.childNodes[2];

            switch (valueNode.type) {
                case "FirstLiteralToken": // Number
                    formEntries.push({
                        type: FormEntryType.Number,
                        key: key,
                        value: Number(valueNode.text)
                    });
                    break;
                
                case "StringLiteral": // String
                    formEntries.push({
                        type: FormEntryType.String,
                        key: key,
                        value: valueNode.text.slice(1, -1)
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

    backwardMapping: new ProgrammableBackwardMapping(({ userInterfaceOutput, documentEditor, fragment }) => {
        // TODO
        console.log("Modified form entry:", userInterfaceOutput.modifiedData)
    }),

    userInterface: {
        name: "form",
        settings: {
            content: <>
                <h4 style={{ textAlign: "center" }}>Test form</h4>
                Some text introducing the purpose of this form and explaining some details.<br/>
                <NumberInput formEntryKey="a" label="Some number" />
                <StringInput formEntryKey="b" label="Some string" />
                <Select formEntryKey="c" items={["foo", "bar"]} />
                Some text explaining the purpose of the next form element.<br/>
                <Switch formEntryKey="d" label="Some boolean" />
                Some conclusive text...<br/>
            </>
        }
    },
    
    renderer: {
        name: "side",
        settings: {
            onlyShowWhenCursorIsInRange: true,
            position: SideRendererPosition.RightSideOfCode
        }
    }
};

// Make evaluators automatically wrap values into a form entry,
// i.e., the kind of object expected by each form element.
function createEvaluatorSettings(key: string, type: FormEntryType): Partial<EvaluatorSettings> {
    if (type === FormEntryType.Color) {
        return {
            transformGetterValue: colorAsText => {
                return { value: Color.fromCss(colorAsText), type, key };
            },
            transformSetterValue: (color: Color) => {
                return color.css;
            }
        };
    }

    return {
        transformGetterValue: value => {
            return { value, type, key };
        }
    };
}

function createEvaluator(key: string, type: FormEntryType): Evaluator {
    const valuatorSettings = createEvaluatorSettings(key, type);
    switch (type) {
        case FormEntryType.Number:
            return new NumericEvaluator(valuatorSettings);
        case FormEntryType.Boolean:
            return new BooleanEvaluator(valuatorSettings);
        case FormEntryType.Color:
            return new TextualEvaluator(valuatorSettings);
        case FormEntryType.String:
        default:
            return new TextualEvaluator(valuatorSettings);
    }
}

const testFormTemplate = JavascriptLiteralObjectTemplate.createForAnyContext(
    [
        { key: "a", evaluator: createEvaluator("a", FormEntryType.Number) },
        { key: "b", evaluator: createEvaluator("b", FormEntryType.String) },
        { key: "c", evaluator: createEvaluator("c", FormEntryType.String) },
        { key: "d", evaluator: createEvaluator("d", FormEntryType.Boolean) },
        { key: "color", evaluator: createEvaluator("color", FormEntryType.Color) }
    ],
    {
        transformTemplateData: data => { return { data: [...Object.values(data)] }; },
        transformUserInterfaceOutput: output => {
            return output.modifiedData.reduce(
                (keysToModifiedEntries: any, entry: any) => {
                    return { ...keysToModifiedEntries, [entry.key]: entry.value  }
                },
                {}
            )
        },
    }
);

export const testFormSpecification_2: ProjectionSpecification<SyntacticFragment> = {
    ...testFormTemplate.resourcesAndMappings,

    name: "Form test",

    requirements: { languages: ["typescript"] },

    userInterface: {
        name: "form",
        settings: {
            content: <>
                <h4 style={{ textAlign: "center" }}>Test form</h4>
                Some text introducing the purpose of this form and explaining some details.<br/>
        
                <NumberInput formEntryKey="a" label="Some number" />
                <StringInput formEntryKey="b" label="Some string" />
                <Select formEntryKey="c" items={["foo", "bar"]} />
        
                Editable text can also be bound to slots: try changing <EditableText formEntryKey="b"></EditableText> for instance!<br/>
        
                Some text explaining the purpose of the next form element.<br/>
                <Switch formEntryKey="d" label="Some boolean" />
        
                Test of a button colour picker followed by a group of buttons: <br/>
                <ButtonColorPicker
                    formEntryKey="color"
                    style={{ margin: "0 1ex" }}
                />
                <ButtonGroup>
                    <Button<FormEntryType.Color>
                        formEntryKey="color"
                        text="Red"
                        valueWithType={[RED, FormEntryType.Color]}
                        activateOn={color => (color && color.equals(RED)) ?? false}
                        style={{ color: "darkred" }}
                    />
                    <Button<FormEntryType.Color>
                        formEntryKey="color"
                        text="Green"
                        valueWithType={[GREEN, FormEntryType.Color]}
                        activateOn={color => (color && color.equals(GREEN)) ?? false}
                        style={{ color: "darkgreen" }}
                    />
                    <Button<FormEntryType.Color>
                        formEntryKey="color"
                        text="Blue"
                        valueWithType={[BLUE, FormEntryType.Color]}
                        activateOn={color => (color && color.equals(BLUE)) ?? false}
                        style={{ color: "darkblue" }}
                    />
                </ButtonGroup>
                <br/>
        
                Some conclusive text...<br/>
            </>
        }
    },
    
    renderer: {
        name: "side",
        settings: {
            onlyShowWhenCursorIsInRange: true,
            position: SideRendererPosition.RightSideOfCode
        }
    }
};
