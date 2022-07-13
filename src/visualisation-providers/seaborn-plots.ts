import { SyntacticPattern } from "../core/code-patterns/syntactic/SyntacticPattern";
import { SyntacticPatternFinder } from "../core/code-patterns/syntactic/SyntacticPatternFinder";
import { FunctionCallNode } from "../core/languages/python/nodes/FunctionCallNode";
import { StringNode } from "../core/languages/python/nodes/StringNode";
import { SyntaxTreePattern, SKIP_MATCH_DESCENDANTS } from "../core/languages/SyntaxTreePattern";
import { ProgrammableInputMapping } from "../core/mappings/ProgrammableInputMapping";
import { ProgrammableOutputMapping } from "../core/mappings/ProgrammableOutputMapping";
import { AsideRenderer } from "../core/renderers/aside/AsideRenderer";
import { AsideRendererPosition } from "../core/renderers/aside/AsideRendererSettings";
import { isEnabledAndDefined } from "../core/user-interfaces/style-inspector/inspectors/SpecialisedStyleInspector";
import { Input, Output, StyleInspector } from "../core/user-interfaces/style-inspector/StyleInspector";
import { SyntacticCodeVisualisationProvider } from "../core/visualisations/syntactic/SyntacticCodeVisualisationProvider";
import { createNamedArgumentProcesser, convertColorFromExpression, createNamedArgumentModifyer } from "../utilities/languages/python";
import { ValueWithUnit } from "../utilities/ValueWithUnit";

export const seabornBarplotStyleInspectorProvider = new SyntacticCodeVisualisationProvider(
    "Seaborn style (barplots)",
    { languages: ["python"] },
    new SyntacticPatternFinder(new SyntaxTreePattern(n =>
        n.type === "FunctionCall"
            && (n as FunctionCallNode).callee.text === "barplot",
        SKIP_MATCH_DESCENDANTS
    )),
    [],
    
    new ProgrammableInputMapping(arg => {
        const barplotCallNode = (arg.pattern as SyntacticPattern).node as FunctionCallNode;
        const namedArguments = barplotCallNode.arguments.namedArguments;

        const background: Input["style"]["background"] = {};
        const border: Input["style"]["border"] = {};

        const processNamedArgument = createNamedArgumentProcesser(namedArguments);

        // Background color.
        processNamedArgument("color", expression => {
            convertColorFromExpression(expression, color => {
                background.color = color;
            });
        });

        // Border color.
        processNamedArgument("edgecolor", expression => {
            convertColorFromExpression(expression, color => {
                border.color = color;
            });
        });

        // Border thickness.
        processNamedArgument("linewidth", expression => {
            const thickness = Number(expression.text);
            if (!Number.isNaN(thickness)) {
                border.thickness = new ValueWithUnit(thickness, "px");
            }
        });

        // Border type.
        processNamedArgument(["linestyle", "ls"], expression => {
            if (expression.value.is(StringNode)) {
                switch (expression.value.content) {
                    case "-":
                    case "solid":
                        border.type = "solid";
                        break;
                    case "--":
                    case "dashed":
                        border.type = "dashed";
                        break;
                    case ":":
                    case "dotted":
                        border.type = "dotted";
                        break;
                    default:
                        // Other values are not supported by the syle inspector: we ignore them.
                        break;
                }
            }
        });

        return {
            style: {
                background: background,
                border: border,
            },
            settings: {
                inspectors: {
                    font: { show: false }
                }
            }
        };
    }),
    new ProgrammableOutputMapping(arg => {
        const output = arg.output as Output;
        const document = arg.document;
        const editor = output.editor;
        const styleChange = output.data.styleChange;

        const barplotCallNode = (arg.pattern as SyntacticPattern).node as FunctionCallNode;
        const modifyNamedArgument = createNamedArgumentModifyer(document, editor, barplotCallNode);

        const backgroundColorProperty = styleChange.background?.color;
        if (isEnabledAndDefined(backgroundColorProperty)) {
            modifyNamedArgument("color", `"${backgroundColorProperty.hexString}"`);
        }

        const borderColorProperty = styleChange.border?.color;
        if (isEnabledAndDefined(borderColorProperty)) {
            modifyNamedArgument("edgecolor", `"${borderColorProperty.hexString}"`);
        }

        const borderThicknessProperty = styleChange.border?.thickness;
        if (isEnabledAndDefined(borderThicknessProperty)) {
            modifyNamedArgument(
                "linewidth",
                borderThicknessProperty.value.toString(),
                thickness => thickness === "0"
            );
        }

        const borderTypeProperty = styleChange.border?.type;
        if (isEnabledAndDefined(borderTypeProperty)) {
            modifyNamedArgument(
                ["linestyle", "ls"],
                `"${borderTypeProperty.toString()}"`,
                type => type === "solid"
            );
        }

        editor.applyEdits();
    }),
    
    StyleInspector.makeProvider(),
    // InputPrinter.makeProvider(),
    // ButtonPopoverRenderer.makeProvider({
    //     buttonContent: "🎨 Style"
    // })
    AsideRenderer.makeProvider({
        onlyShowWhenCursorIsInRange: true,
        position: AsideRendererPosition.RightSideOfCode,
        positionOffset: 150
    })
);