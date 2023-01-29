import { TreePatternFinder } from "../core/fragments/syntactic/TreePatternFinder";
import { FunctionCallNode } from "../core/languages/python/nodes/FunctionCallNode";
import { StringNode } from "../core/languages/python/nodes/StringNode";
import { SyntaxTreePattern, SKIP_MATCH_DESCENDANTS } from "../core/languages/SyntaxTreePattern";
import { ProgrammableInputMapping } from "../core/mappings/ProgrammableInputMapping";
import { ProgrammableOutputMapping } from "../core/mappings/ProgrammableOutputMapping";
import { AsideRenderer } from "../core/renderers/aside/AsideRenderer";
import { AsideRendererPosition } from "../core/renderers/aside/AsideRendererSettings";
import { isEnabledAndDefined } from "../core/user-interfaces/style-inspector/inspectors/SpecialisedStyleInspector";
import { Input, StyleInspector } from "../core/user-interfaces/style-inspector/StyleInspector";
import { SyntacticMonocleProvider } from "../core/monocles/syntactic/SyntacticMonocleProvider";
import { createNamedArgumentProcesser, convertColorFromExpression, createNamedArgumentModifyer } from "../utilities/languages/python/python-utilities";
import { ValueWithUnit } from "../utilities/ValueWithUnit";
import { PythonFunctionCallNamedArgumentsTemplate } from "../utilities/languages/python/PythonFunctionCallNamedArgumentsTemplate";
import { TextualValuator } from "../core/templates/valuators/TextualValuator";
import { Color } from "../utilities/Color";
import { NumericValuator } from "../core/templates/valuators/NumericValuator";

export const seabornBarplotStyleInspectorProvider = new SyntacticMonocleProvider({
    name: "Seaborn style (barplots)",

    usageRequirements: { languages: ["python"] },

    fragmentProvider: new TreePatternFinder(new SyntaxTreePattern(n =>
        n.type === "FunctionCall"
            && (n as FunctionCallNode).callee.text === "barplot",
        SKIP_MATCH_DESCENDANTS
    )),

    inputMapping: new ProgrammableInputMapping(({ fragment }) => {
        const barplotCallNode = fragment.node as FunctionCallNode;
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

    outputMapping: new ProgrammableOutputMapping(({ output, document, documentEditor, fragment }) => {
        const styleChange = output.styleChange;

        const barplotCallNode = fragment.node as FunctionCallNode;
        const modifyNamedArgument = createNamedArgumentModifyer(document, documentEditor, barplotCallNode);

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

        documentEditor.applyEdits();
    }),

    userInterfaceProvider: StyleInspector.makeProvider(),
    
    rendererProvider: AsideRenderer.makeProvider({
        onlyShowWhenCursorIsInRange: true,
        position: AsideRendererPosition.RightSideOfCode,
        positionOffset: 150
    })
});

const colorValuator = new TextualValuator({
    transformGetterValue: text => Color.fromCss(text),
    transformSetterValue: (color: Color) => color.css
});

const pixelLengthValuator = new NumericValuator({
    transformGetterValue: value => new ValueWithUnit(value, "px"),
    transformSetterValue: (length: ValueWithUnit) => length.value
});

const lineStyleValuator = new TextualValuator({
    transformGetterValue: value => {
        return {
            "-": "solid",
            "--": "dashed",
            ":": "dotted"
        }[value] ?? value;
    }
});

const barplotCallTemplate = PythonFunctionCallNamedArgumentsTemplate.createForFunctionNamed(
    name => name.endsWith("barplot"),
    [
        { key: "color", valuator: colorValuator },
        { key: "edgecolor", valuator: colorValuator },
        { key: "linewidth", valuator: pixelLengthValuator, defaultValue: 0 },
        { key: "linestyle", valuator: lineStyleValuator, defaultValue: "solid" },
        { key: "ls", valuator: lineStyleValuator },
    ],
    {
        transformTemplateData: data => {
            const background: any = {};
            if (data.color) { background.color = data.color; }

            const border: any = {};
            if (data.edgecolor) { border.color = data.edgecolor; }
            if (data.linewidth) { border.thickness = data.linewidth; }
            if (data.linestyle || data.ls) { border.color = data.linestyle ?? data.ls; }

            return {
                style: { background, border },
                settings: {
                    inspectors: { font: { show: false } }
                }
            }
        },

        transformUserInterfaceOutput: output => {
            const modifiedData: any = {};

            const background = output.styleChange.background;
            if (background) {
                if (background.color) { modifiedData.color = background.color; }
            }

            const border = output.styleChange.border;
            if (border) {
                if (border.color) { modifiedData.edgecolor = border.color; }
                if (border.thickness) { modifiedData.linewidth = border.thickness; }
                if (border.type) { modifiedData.linestyle = border.type; }
            }

            return modifiedData;
        }
    }
);

export const seabornBarplotStyleInspectorProvider2 = new SyntacticMonocleProvider({
    name: "Seaborn style (barplots)",

    usageRequirements: { languages: ["python"] },

    ...barplotCallTemplate.monocleProviderProperties,

    // userInterfaceProvider: InputPrinter.makeProvider(),
    userInterfaceProvider: StyleInspector.makeProvider(),
    
    rendererProvider: AsideRenderer.makeProvider({
        onlyShowWhenCursorIsInRange: true,
        position: AsideRendererPosition.RightSideOfCode,
        positionOffset: 150
    })
});
