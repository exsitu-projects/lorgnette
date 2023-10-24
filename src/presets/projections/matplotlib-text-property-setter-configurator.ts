import { TreePatternFinder } from "../../core/fragments/syntactic/TreePatternFinder";
import { FunctionCallNode } from "../languages/python/nodes/FunctionCallNode";
import { StringNode } from "../languages/python/nodes/StringNode";
import { SyntaxTreePattern, SKIP_MATCH_DESCENDANTS } from "../../core/languages/SyntaxTreePattern";
import { ProgrammableBackwardMapping } from "../../core/mappings/ProgrammableBackwardMapping";
import { SideRendererPosition } from "../renderers/side/SideRendererSettings";
import { isEnabledAndDefined, DISABLED_PROPERTY } from "../user-interfaces/style-inspector/inspectors/SpecialisedStyleInspector";
import { Input } from "../user-interfaces/style-inspector/StyleInspector";
import { createNamedArgumentProcesser, convertColorFromExpression, createNamedArgumentModifyer } from "../../utilities/languages/python/python-utilities";
import { ValueWithUnit } from "../../utilities/ValueWithUnit";
import { ProjectionSpecification } from "../../core/projections/ProjectionSpecification";
import { SyntacticFragment } from "../../core/fragments/syntactic/SyntacticFragment";
import { ProgrammableForwardMapping } from "../../core/mappings/ProgrammableForwardMapping";

export const matplotlibTextPropertySetterConfiguratorSpecification: ProjectionSpecification<SyntacticFragment> = {
    name: "Matplotlib text property setter configurator",

    requirements: { languages: ["python"] },

    pattern: new TreePatternFinder(new SyntaxTreePattern(n =>
        n.type === "FunctionCall"
            && [
                "set_title",
                "set_xlabel",
                "set_ylabel",
                "set_xticks",
                "set_yticks",
            ].some(functionName => (n as FunctionCallNode).callee.text.endsWith(functionName)),
        SKIP_MATCH_DESCENDANTS
    )),

    forwardMapping: new ProgrammableForwardMapping<SyntacticFragment>(({ fragment }) => {
        const functionCallNode = fragment.node as FunctionCallNode;
        const namedArguments = functionCallNode.arguments.namedArguments;

        const background: Input["style"]["background"] = {};
        const font: Input["style"]["font"] = {
            underline: DISABLED_PROPERTY
        };
        const processNamedArgument = createNamedArgumentProcesser(namedArguments);

        // Background color.
        processNamedArgument("backgroundcolor", expression => {
            convertColorFromExpression(expression, color => {
                background.color = color;
            });
        });

        // Font size.
        processNamedArgument(["fontsize", "size"], expression => {
            const size = Number(expression.text);
            if (!Number.isNaN(size)) {
                font.size = new ValueWithUnit(size, "pt");
            }
        });


        // Font weight and style (italic).
        processNamedArgument(["fontweight", "weight"], expression => {
            if (expression.value.is(StringNode)) {
                switch (expression.value.content) {
                    case "bold":
                        font.bold = true;
                        break;
                    default:
                        // Other values are not supported by the syle inspector: we ignore them.
                        break;
                }
            }
        });

        processNamedArgument(["fontstyle", "style"], expression => {
            if (expression.value.is(StringNode)) {
                switch (expression.value.content) {
                    case "italic":
                        font.italic = true;
                        break;
                    default:
                        // Other values are not supported by the syle inspector: we ignore them.
                        break;
                }
            }
        });

        // Text color.
        processNamedArgument(["color", "c"], expression => {
            convertColorFromExpression(expression, color => {
                font.color = color;
            });
        });

        // Font family.
        processNamedArgument(["fontfamily", "family"], expression => {
            if (expression.value.is(StringNode)) {
                font.family = [expression.value.content];
            }
        });

        return {
            style: {
                background: background,
                font: font
            },
            settings: {
                defaultStyle: {
                    font: { size: new ValueWithUnit(10, "pt") }
                },
                inspectors: {
                    border: { show: false }
                }
            }
        };
    }),

    backwardMapping: new ProgrammableBackwardMapping<SyntacticFragment>(({ userInterfaceOutput, document, documentEditor, fragment }) => {
        const styleChange = userInterfaceOutput.styleChange;

        const barplotCallNode = fragment.node as FunctionCallNode;
        const modifyNamedArgument = createNamedArgumentModifyer(document, documentEditor, barplotCallNode);

        const backgroundColorProperty = styleChange.background?.color;
        if (isEnabledAndDefined(backgroundColorProperty)) {
            modifyNamedArgument("backgroundcolor", `"${backgroundColorProperty.hexString}"`);
        }

        const fontColorProperty = styleChange.font?.color;
        if (isEnabledAndDefined(fontColorProperty)) {
            modifyNamedArgument(["color", "c"], `"${fontColorProperty.hexString}"`);
        }

        const fontSizeProperty = styleChange.font?.size;
        if (isEnabledAndDefined(fontSizeProperty)) {
            modifyNamedArgument(
                ["size", "fontsize"],
                fontSizeProperty.value.toString(),
                size => size === "10"
            );
        }

        const fontFamilyProperty = styleChange.font?.family;
        if (isEnabledAndDefined(fontFamilyProperty)) {
            modifyNamedArgument(
                ["family", "fontfamily"],
                fontFamilyProperty.length >= 1 ? `"${fontFamilyProperty[0]}"` : "",
                value => ["", `"sans-serif"`].includes(value)
            );
        }

        const fontIsBoldProperty = styleChange.font?.bold;
        if (isEnabledAndDefined(fontIsBoldProperty)) {
            modifyNamedArgument(
                ["weight", "fontweight"],
                fontIsBoldProperty ? `"bold"` : `"normal"`,
                value => value === `"normal"`
            );
        }

        const fontIsItalicProperty = styleChange.font?.italic;
        if (isEnabledAndDefined(fontIsItalicProperty)) {
            modifyNamedArgument(
                ["style", "fontstyle"],
                fontIsItalicProperty ? `"italic"` : `"normal"`,
                value => value === `"normal"`
            );
        }

        documentEditor.applyEdits();
    }),

    userInterface: "style-inspector",

    renderer: {
        name: "side",
        settings: {
            onlyShowWhenCursorIsInRange: true,
            position: SideRendererPosition.RightSideOfCode,
            positionOffset: 150
        }
    }
};
