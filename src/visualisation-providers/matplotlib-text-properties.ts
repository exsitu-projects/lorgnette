import { SyntacticPattern } from "../core/code-patterns/syntactic/SyntacticPattern";
import { SyntacticPatternFinder } from "../core/code-patterns/syntactic/SyntacticPatternFinder";
import { FunctionCallNode } from "../core/languages/python/nodes/FunctionCallNode";
import { StringNode } from "../core/languages/python/nodes/StringNode";
import { SyntaxTreePattern, SKIP_MATCH_DESCENDANTS } from "../core/languages/SyntaxTreePattern";
import { ProgrammableInputMapping } from "../core/mappings/ProgrammableInputMapping";
import { ProgrammableOutputMapping } from "../core/mappings/ProgrammableOutputMapping";
import { AsideRenderer } from "../core/renderers/aside/AsideRenderer";
import { AsideRendererPosition } from "../core/renderers/aside/AsideRendererSettings";
import { isEnabledAndDefined, DISABLED_PROPERTY } from "../core/user-interfaces/style-inspector/inspectors/SpecialisedStyleInspector";
import { Input, Output, StyleInspector } from "../core/user-interfaces/style-inspector/StyleInspector";
import { SyntacticCodeVisualisationProvider } from "../core/visualisations/syntactic/SyntacticCodeVisualisationProvider";
import { createNamedArgumentProcesser, convertColorFromExpression, createNamedArgumentModifyer } from "../utilities/languages/python";
import { ValueWithUnit } from "../utilities/ValueWithUnit";

export const matplotlibTextPropertySetterStyleInspectorProvider = new SyntacticCodeVisualisationProvider(
    "Seaborn style (text properties)",
    { languages: ["python"] },
    new SyntacticPatternFinder(new SyntaxTreePattern(n =>
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
    [],
    
    new ProgrammableInputMapping(arg => {
        const functionCallNode = (arg.pattern as SyntacticPattern).node as FunctionCallNode;
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
                    font: { size: new ValueWithUnit(10, "pt")}
                },
                inspectors: {
                    border: { show: false }
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

        editor.applyEdits();
    }),
    
    StyleInspector.makeProvider(),
    // InputPrinter.makeProvider(),
    // ButtonPopoverRenderer.makeProvider({
    //     buttonContent: "🎨 Font"
    // })
    AsideRenderer.makeProvider({
        onlyShowWhenCursorIsInRange: true,
        position: AsideRendererPosition.RightSideOfCode,
        positionOffset: 150
    })
);
