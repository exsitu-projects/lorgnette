import { Block, Declaration, Raw } from "css-tree";
import { SyntacticPattern } from "../core/code-patterns/syntactic/SyntacticPattern";
import { SyntacticPatternFinder } from "../core/code-patterns/syntactic/SyntacticPatternFinder";
import { Position } from "../core/documents/Position";
import { Range } from "../core/documents/Range";
import { SyntaxTreePattern, SKIP_MATCH_DESCENDANTS } from "../core/languages/SyntaxTreePattern";
import { ProgrammableInputMapping } from "../core/mappings/ProgrammableInputMapping";
import { ProgrammableOutputMapping } from "../core/mappings/ProgrammableOutputMapping";
import { AsideRenderer } from "../core/renderers/aside/AsideRenderer";
import { AsideRendererPosition } from "../core/renderers/aside/AsideRendererSettings";
import { ButtonPopoverRenderer } from "../core/renderers/popover/ButtonPopoverRenderer";
import { Margin } from "../core/user-interfaces/style-inspector/inspectors/MarginInspector";
import { DISABLED_PROPERTY, isEnabledAndDefined } from "../core/user-interfaces/style-inspector/inspectors/SpecialisedStyleInspector";
import { Style } from "../core/user-interfaces/style-inspector/Style";
import { Input, Output, StyleInspector } from "../core/user-interfaces/style-inspector/StyleInspector";
import { SyntacticMonocleProvider } from "../core/visualisations/syntactic/SyntacticMonocleProvider";
import { Color, BLACK } from "../utilities/Color";
import { ValueWithUnit } from "../utilities/ValueWithUnit";

export const cssPropertyStyleInspectorProvider = new SyntacticMonocleProvider({
    name: "CSS style editor",

    usageRequirements: { languages: ["css"] },

    patternFinder: new SyntacticPatternFinder(new SyntaxTreePattern(
        n => n.type === "Rule",
        SKIP_MATCH_DESCENDANTS
    )),

    inputMapping: new ProgrammableInputMapping(arg => {
        const blockNode = (arg.pattern as SyntacticPattern).node.childNodes[1];
        const blockCssNode = blockNode.parserNode as Block;

        const propertyNamesToValues = new Map(
            blockCssNode.children.toArray()
                .filter(cssNode => cssNode.type === "Declaration")
                .map(cssNode => [(cssNode as Declaration).property, (cssNode as Declaration).value as Raw])
        );

        const uniqueCssPropertyNamesAndValues = [...propertyNamesToValues];

        let style: Style = {};

        const addProperty = <K1 extends keyof Style, K2 extends keyof NonNullable<Style[K1]>>(
            cssProperty: [string, Raw],
            targetCssPropertyName: string,
            styleKey: K1,
            stylePropertyKey: K2,
            disableOrTransformValue: typeof DISABLED_PROPERTY | ((cssNode: Raw) => NonNullable<Style[K1]>[K2])
        ) => {
            if (cssProperty[0] === targetCssPropertyName ) {
                if (!style[styleKey]) {
                    style[styleKey] = {};
                }

                try {
                    const properties = style[styleKey]!;
                    (properties[stylePropertyKey] as NonNullable<Style[K1]>[K2] | typeof DISABLED_PROPERTY) =
                        disableOrTransformValue === DISABLED_PROPERTY
                            ? DISABLED_PROPERTY
                            : disableOrTransformValue(cssProperty[1]);
                }
                catch (error) { }
            }
        };

        const addProperties = <K extends keyof Style>(
            cssProperty: [string, Raw],
            targetCssPropertyName: string,
            styleKey: K,
            transform: (cssNode: Raw) => Partial<Style[K]>
        ) => {
            if (cssProperty[0] === targetCssPropertyName) {
                if (!style[styleKey]) {
                    style[styleKey] = {};
                }

                try {
                    style[styleKey] = transform(cssProperty[1]);
                }
                catch (error) { }
            }
        };

        for (let cssProperty of uniqueCssPropertyNamesAndValues) {
            // Background properties.
            addProperty(cssProperty, "background-color", "background", "color", cssNode => Color.fromCss(cssNode.value));

            // Border properties.

            // addProperty(cssProperty, "border-color", "border", "color", cssNode => Color.fromCss(cssNode.value));
            // addProperty(cssProperty, "border-width", "border", "thickness", cssNode =>
            //     ValueWithUnit.fromText(cssNode.value) ?? undefined
            // );
            // addProperty(cssProperty, "border-style", "border", "type", cssNode => {
            //     const value = cssNode.value;
            //     switch (value) {
            //         case "solid":
            //         case "dashed":
            //         case "dotted":
            //             return value;

            //         default:
            //         return undefined;
            //     }
            // });

            addProperties(cssProperty, "border", "border", cssNode => {
                const borderProperties = cssNode.value.split(" ");

                const rawBorderType = borderProperties[1];
                let borderType = undefined;
                if (["solid", "dashed", "dotted"].includes(rawBorderType)) {
                    borderType = borderProperties[1] as "solid" | "dashed" | "dotted";
                }

                return {
                    thickness: ValueWithUnit.fromText(borderProperties[0]) ?? undefined,
                    color: Color.fromCss(borderProperties[2]),
                    type: borderType,
                };
            })

            // Font properties.
            addProperty(cssProperty, "color", "font", "color", cssNode => Color.fromCss(cssNode.value));
            addProperty(cssProperty, "font-size", "font", "size", cssNode => ValueWithUnit.fromText(cssNode.value) ?? undefined);
            addProperty(cssProperty, "font-family", "font", "family", cssNode =>
                cssNode.value
                    .split(",")
                    .map(familyName => familyName.replaceAll(/"'/g, ""))
            );

            addProperty(cssProperty, "font-weight", "font", "bold", cssNode =>
                cssNode.value === "bold" ||
                cssNode.value === "700" ||
                cssNode.value === "800" ||
                cssNode.value === "900"
            );

            addProperty(cssProperty, "font-style", "font", "italic", cssNode => cssNode.value === "italic");
            addProperty(cssProperty, "text-decoration", "font", "underline", cssNode => cssNode.value.includes("underline"));

            // Margin properties.
            function computeMarginFromCssValue(cssNode: Raw): Margin {
                const marginValues = cssNode.value
                    .split(" ")
                    .map(valueWithUnitAsText => ValueWithUnit.fromText(valueWithUnitAsText));

                let top, bottom, left, right;
                switch (marginValues.length) {
                    case 1:
                        top = bottom = left = right = marginValues[0]!;
                        break;
                    case 2:
                        top = bottom = marginValues[0]!;
                        left = right = marginValues[1]!;
                        break;
                    case 3:
                        top = marginValues[0]!;
                        left = right = marginValues[1]!;
                        bottom = marginValues[2]!;
                        break;
                    case 4:
                        top = marginValues[0]!;
                        right = marginValues[1]!;
                        bottom = marginValues[2]!;
                        left = marginValues[3]!;
                        break;
                    default:
                        throw new Error("Unknown number of values for a margin/padding.");
                }

                return { top, bottom, left, right };
            };

            addProperty(cssProperty, "margin", "margin", "outer", cssNode => computeMarginFromCssValue(cssNode));
            addProperty(cssProperty, "padding", "margin", "inner", cssNode => computeMarginFromCssValue(cssNode));
        }

        const input: Input = {
            style: style,
            settings: {
                defaultStyle: {
                    font: {
                        // bold: DISABLED_PROPERTY
                    }
                }
            }
        };

        return input;
    }),

    outputMapping: new ProgrammableOutputMapping(arg => {
        const output = arg.output as Output;
        const document = arg.document;
        const editor = output.editor;
        const styleChange = output.data.styleChange;

        console.log(styleChange)

        // Get the current properties of the CSS rule.
        const blockNode = (arg.pattern as SyntacticPattern).node.childNodes[1];
        // const blockCssNode = blockNode.parserNode as Block;

        const cssProperties = blockNode.childNodes.filter(node => node.parserNode.type === "Declaration");
        const cssPropertyNamesToAstNodes = new Map(
            cssProperties.map(node => [(node.parserNode as Declaration).property, node])
        );

        const propertiesToInsert: {name: string, value: string}[] = [];
        const propertiesToRemove: string[] = [];

        // If the property already exists in the CSS rule, updates its value (string) or remove the property (null).
        // Otherwise, add the property to the list of properties that must be inserted in the CSS rule.
        const REMOVE_PROPERTY = Symbol("Remove CSS property");
        function modifyProperty(
            cssPropertyName: string,
            newValue: string | typeof REMOVE_PROPERTY
        ): void {
            if (newValue === REMOVE_PROPERTY) {
                propertiesToRemove.push(cssPropertyName);
                return;
            }

            const cssPropertyAstNode = cssPropertyNamesToAstNodes.get(cssPropertyName);
            if (cssPropertyAstNode) {
                editor.replace(
                    cssPropertyAstNode.childNodes[0].range,
                    newValue
                );
            }
            else {
                propertiesToInsert.push({
                    name: cssPropertyName,
                    value: newValue
                });
            }
        }

        // Background.
        const backgroundChange = styleChange.background;
        if (backgroundChange) {
            if (isEnabledAndDefined(backgroundChange.color)) {
                modifyProperty("background-color", backgroundChange.color.css);
            }
        }

        // Border.
        const borderChange = styleChange.border;
        if (borderChange) {
            const borderWidth = (borderChange.thickness ?? new ValueWithUnit(1, "px")).toString();
            const borderStyle = isEnabledAndDefined(borderChange.type) && !Array.isArray(borderChange.type)
                ? borderChange.type
                : "solid";
            const borderColor = (isEnabledAndDefined(borderChange.color) ? borderChange.color : BLACK).css;
            
            modifyProperty("border", `${borderWidth} ${borderStyle} ${borderColor}`);
        }

        // Font.
        const fontChange = styleChange.font;
        if (fontChange) {
            if (isEnabledAndDefined(fontChange.size)) {
                modifyProperty("font-size", fontChange.size.toString());
            }

            if (isEnabledAndDefined(fontChange.bold)) {
                modifyProperty("font-weight", fontChange.bold ? "bold" : REMOVE_PROPERTY);
            }

            if (isEnabledAndDefined(fontChange.italic)) {
                modifyProperty("font-style", fontChange.italic ? "italic" : REMOVE_PROPERTY);
            }

            if (isEnabledAndDefined(fontChange.underline)) {
                modifyProperty("text-decoration", fontChange.underline ? "underline" : REMOVE_PROPERTY);
            }

            if (isEnabledAndDefined(fontChange.color)) {
                modifyProperty("color", fontChange.color.css);
            }

            if (isEnabledAndDefined(fontChange.family)) {
                const concatenatedFamilyNames = fontChange.family
                    .map(familyName => {
                        const trimmedFamilyName = familyName.trim();
                        return trimmedFamilyName.includes(" ")
                            ? `"${trimmedFamilyName}"`
                            : trimmedFamilyName;
                    })
                    .join(", ");
                
                modifyProperty("font-family", concatenatedFamilyNames);
            }
        }

        // Margins.
        const marginChange = styleChange.margin;
        function createCssValueFromMargin(margin: Margin): string {
            let marginAsText = "";

            if (margin.left === margin.right) {
                if (margin.top === margin.bottom) {
                    if (margin.top === margin.left) {
                        marginAsText = `${margin.top}`;
                    }
                    else {
                        marginAsText = `${margin.top} ${margin.left}`;
                    }
                }
                else {
                    marginAsText = `${margin.top} ${margin.left} ${margin.bottom}`;
                }
                marginAsText = `${margin.top} ${margin.right} ${margin.bottom} ${margin.left}`;
            }

            return marginAsText;
        }

        if (marginChange) {
            if (isEnabledAndDefined(marginChange.inner)) {
                modifyProperty("padding", createCssValueFromMargin(marginChange.inner));
            }

            if (isEnabledAndDefined(marginChange.outer)) {
                modifyProperty("margin", createCssValueFromMargin(marginChange.outer));
            }
        }

        // Insert all the new properties.
        const hasPropertiesToInsert = propertiesToInsert.length > 0;
        if (hasPropertiesToInsert) {
            const concatenatedPropertiesToInsert = propertiesToInsert
                .map(property => `\n\t${property.name}: ${property.value};`)
                .join("");

            const cssRuleHasExistingProperties = cssProperties.length > 0;
            if (cssRuleHasExistingProperties) {
                editor.insert(
                    cssProperties[cssProperties.length - 1].range.end.shiftBy(0, 1, 1),
                    `${concatenatedPropertiesToInsert}`
                );
            }
            else {
                editor.replace(
                    blockNode.range,
                    `{${concatenatedPropertiesToInsert}\n}`
                );
            }
        }

        // Delete all the properties to remove.
        const hasPropertiesToRemove = propertiesToRemove.length > 0;
        if (hasPropertiesToRemove) {
            const convertOffsetToPosition = Position.getOffsetToPositionConverterForText(document.content);

            for (let propertyName of propertiesToRemove) {
                const astNode = cssPropertyNamesToAstNodes.get(propertyName);
                if (!astNode) {
                    continue;
                }

                const propertyRange = new Range(
                    astNode.range.start,
                    astNode.range.end.shiftBy(0, 1, 1) // to include ';'
                );

                // Delete the whitespace surrounding the property as well (if any).
                const rangeBeforePropertyInFirstPropertyLine = Range.fromLineStartTo(propertyRange.start);
                const textBeforePropertyInFirstPropertyLine = document.getContentInRange(rangeBeforePropertyInFirstPropertyLine);
                const sameLineTextBeforePropertyIsWhitespace = !!textBeforePropertyInFirstPropertyLine.match(/\s+/);
                
                const textInLastPropertyLine = document.getContentInLine(propertyRange.end.row);
                const rangeAfterPropertyInLastPropertyLine = Range.toLineEndFrom(propertyRange.end, textInLastPropertyLine.length);
                const textAfterPropertyInLastPropertyLine = document.getContentInRange(rangeAfterPropertyInLastPropertyLine);
                const sameLineTextAfterPropertyIsWhitespace = !!textAfterPropertyInLastPropertyLine.match(/\s+/);

                let rangeToDelete = propertyRange;
                if (sameLineTextBeforePropertyIsWhitespace) {
                    // In this situation, also remove the '\n' character that precede the whitespace on the first line.
                    const endOfLineBeforeProperty = convertOffsetToPosition(
                        Math.max(0, rangeBeforePropertyInFirstPropertyLine.start.offset - 1)
                    );

                    rangeToDelete = rangeToDelete.with({ start: endOfLineBeforeProperty });
                }
                if (sameLineTextAfterPropertyIsWhitespace) {
                    rangeToDelete = rangeToDelete.with({ end: rangeAfterPropertyInLastPropertyLine.end });
                }

                editor.delete(rangeToDelete);
            }
        }

        editor.applyEdits();
    }),

    userInterfaceProvider: StyleInspector.makeProvider(),
    
    rendererProvider: ButtonPopoverRenderer.makeProvider({
        buttonContent: "Inspect 🎨",
    }),
    // rendererProvider: AsideRenderer.makeProvider({
    //     onlyShowWhenCursorIsInRange: true,
    //     position: AsideRendererPosition.RightSideOfCode,
    //     positionOffset: 50
    // }),
});
