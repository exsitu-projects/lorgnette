import React from "react";
import { SyntacticPatternFinder } from "./core/code-patterns/syntactic/SyntacticPatternFinder";
import { SyntacticPattern } from "./core/code-patterns/syntactic/SyntacticPattern";
import { SyntaxTreeNode } from "./core/languages/SyntaxTreeNode";
import { SKIP_MATCH_DESCENDANTS, SyntaxTreePattern } from "./core/languages/SyntaxTreePattern";
import { ProgrammableInputMapping } from "./core/mappings/ProgrammableInputMapping";
import { ProgrammableOutputMapping } from "./core/mappings/ProgrammableOutputMapping";
import { ColorPicker } from "./core/user-interfaces/color-picker/ColorPicker";
import { NodeMoveProcesser } from "./core/user-interfaces/tree/utilities/NodeMoveProcesser";
import { SyntacticCodeVisualisationProvider } from "./core/visualisations/syntactic/SyntacticCodeVisualisationProvider";
import { RegexPatternFinder } from "./core/code-patterns/textual/RegexPatternFinder";
import { ProgrammableSiteProvider } from "./core/sites/syntactic/ProgrammableSiteProvider";
import { RangeSiteProvider } from "./core/sites/textual/RangeSiteProvider";
import { RegexSiteProvider } from "./core/sites/textual/RegexSiteProvider";
import { TextualCodeVisualisationProvider } from "./core/visualisations/textual/TextualCodeVisualisationProvider";
import { Range } from "./core/documents/Range";
import { Tree, TreeNode } from "./core/user-interfaces/tree/Tree";
import { PropertyNode } from "./core/languages/json/nodes/PropertyNode";
import { ObjectNode } from "./core/languages/json/nodes/ObjectNode";
import { StringNode } from "./core/languages/json/nodes/StringNode";
import { Output as PlotStyleEditorOutput, PlotStyle, PlotStyleEditor } from "./core/user-interfaces/plot-style-editor/PlotStyleEditor";
import { BLACK, Color, TRANSPARENT, WHITE } from "./utilities/Color";
import { NumberNode } from "./core/languages/json/nodes/NumberNode";
import { BooleanNode } from "./core/languages/json/nodes/BooleanNode";
import { ButtonPopoverRenderer } from "./core/renderers/popover/ButtonPopoverRenderer";
import { AsideRenderer } from "./core/renderers/aside/AsideRenderer";
import { AsideRendererPosition } from "./core/renderers/aside/AsideRendererSettings";
import { ButtonPopupRenderer } from "./core/renderers/popup/ButtonPopupRenderer";
import { RegexEditor } from "./core/user-interfaces/regex-editor/RegexEditor";
import { Block, Declaration, Raw } from "css-tree";
import { Style } from "./core/user-interfaces/style-inspector/Style";
import { Input as StyleInspectorInput, Output as StyleInspectorOutput, StyleInspector } from "./core/user-interfaces/style-inspector/StyleInspector";
import { ValueWithUnit } from "./utilities/ValueWithUnit";
import { Margin } from "./core/user-interfaces/style-inspector/inspectors/MarginInspector";
import { DISABLED_PROPERTY, isDisabled, isEnabledAndDefined } from "./core/user-interfaces/style-inspector/inspectors/SpecialisedStyleInspector";
import { Position } from "./core/documents/Position";

export const DEFAULT_CODE_VISUALISATION_PROVIDERS = [
    // new TextualCodeVisualisationProvider(
    //     "RGB Color constructor",
    //     { languages: ["typescript"] },
    //     new RegexPatternFinder("Color\\((\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\)"),
    //     [
    //         // (?<=) is a non-capturing lookbehind; (?=) is a non-capturing lookahead.
    //         new RegexSiteProvider("(?<=Color\\()(\\d+)"),
    //         new RegexSiteProvider("(?<=Color\\([^,]+,\\s*)(\\d+)"),
    //         new RegexSiteProvider("(?<=Color\\([^,]+,[^,]+,\\s*)(\\d+)"),
    //     ],
    //     new ProgrammableInputMapping(arg => {
    //         return {
    //             r: parseInt(arg.sites[0].text),
    //             g: parseInt(arg.sites[1].text),
    //             b: parseInt(arg.sites[2].text)
    //         };
    //     }),
    //     new ProgrammableOutputMapping(arg => {
    //         const data = arg.output.data;
    //         const documentEditor = arg.output.editor;
    //         const pattern = arg.pattern;
    //         const sites = arg.sites;
            
    //         const adaptSiteRange = (range: Range) => range.relativeTo(pattern.range.start);
            
    //         documentEditor.replace(adaptSiteRange(sites[0].range), data.r.toString());
    //         documentEditor.replace(adaptSiteRange(sites[1].range) ,data.g.toString());
    //         documentEditor.replace(adaptSiteRange(sites[2].range), data.b.toString());
            
    //         documentEditor.applyEdits();
    //     }),
    //     ColorPicker.makeProvider(),
    //     AsideRenderer.makeProvider({
    //         onlyShowWhenCursorIsInRange: true
    //     })
    // ),
        
        
        
        
        
    new TextualCodeVisualisationProvider(
        "Hexadecimal color code",
        {},
        new RegexPatternFinder("#([a-fA-F0-9]{6})"),
        [
            new RangeSiteProvider(1, 2),
            new RangeSiteProvider(3, 4),
            new RangeSiteProvider(5, 6),
        ],
        new ProgrammableInputMapping(arg => {
            return {
                r: parseInt(arg.sites[0].text, 16),
                g: parseInt(arg.sites[1].text, 16),
                b: parseInt(arg.sites[2].text, 16)
            };
        }),
        new ProgrammableOutputMapping(arg => {
            const data = arg.output.data;
            const editor = arg.output.editor;
            const pattern = arg.pattern;
            const sites = arg.sites;
            
            const adaptSiteRange = (range: Range) => range.relativeTo(pattern.range.start);
            const hexOfRgbValue = (n: number) => n.toString(16);
            
            editor.replace(adaptSiteRange(sites[0].range), hexOfRgbValue(data.r));
            editor.replace(adaptSiteRange(sites[1].range), hexOfRgbValue(data.g));
            editor.replace(adaptSiteRange(sites[2].range), hexOfRgbValue(data.b));
            
            editor.applyEdits();
        }),
        ColorPicker.makeProvider(),
        AsideRenderer.makeProvider({
            onlyShowWhenCursorIsInRange: true
        })
    ),
            
            
            
            
            
    // new SyntacticCodeVisualisationProvider(
    //     "RGB Color constructor — Syntactic",
    //     { languages: ["typescript"] },
    //     new SyntacticPatternFinder(new SyntaxTreePattern(n => 
    //         n.type === "NewExpression"
    //             && n.childNodes[1].parserNode.escapedText === "Color"
    //             && n.childNodes[3].childNodes.filter(c => c.type === "FirstLiteralToken").length === 3,
    //         SKIP_MATCH_DESCENDANTS
    //     )),
    //     [
    //         new ProgrammableSiteProvider(p => p.node.childNodes[3].childNodes.filter(c => c.type === "FirstLiteralToken")[0]),
    //         new ProgrammableSiteProvider(p => p.node.childNodes[3].childNodes.filter(c => c.type === "FirstLiteralToken")[1]),
    //         new ProgrammableSiteProvider(p => p.node.childNodes[3].childNodes.filter(c => c.type === "FirstLiteralToken")[2])
    //     ],
    //     new ProgrammableInputMapping(arg => {
    //         const sites = arg.sites;
            
    //         return {
    //             r: parseInt(sites[0].text),
    //             g: parseInt(sites[1].text),
    //             b: parseInt(sites[2].text)
    //         };
    //     }),
    //     new ProgrammableOutputMapping(arg => {
    //         const data = arg.output.data;
    //         const documentEditor = arg.output.editor;
    //         const sites = arg.sites;
            
    //         documentEditor.replace(sites[0].range, data.r.toString());
    //         documentEditor.replace(sites[1].range ,data.g.toString());
    //         documentEditor.replace(sites[2].range, data.b.toString());
            
    //         documentEditor.applyEdits();
    //     }),
    //     ColorPicker.makeProvider(),
    //     AsideRenderer.makeProvider({
    //         onlyShowWhenCursorIsInRange: true
    //     })
    // ),
    




    new SyntacticCodeVisualisationProvider(
        "TSX elements",
        { languages: ["typescript"] },
        new SyntacticPatternFinder(new SyntaxTreePattern(
            n => ["JsxElement", "JsxSelfClosingElement"].includes(n.type),
            SKIP_MATCH_DESCENDANTS
        )),
        [],
        new ProgrammableInputMapping(arg => {
            const pattern = arg.pattern as SyntacticPattern;
            
            const getJsxElementNameFromNode = (node: SyntaxTreeNode, defaultName: string): string => {
                const regex = /<\s*(\w+).*/;
                const regexMatch = regex.exec(node.parserNode.getFullText() as string);
                
                return regexMatch ? regexMatch[1] : defaultName;
            };
            
            const abbreviateJsxElementContent = (node: SyntaxTreeNode): string => {
                return node.parserNode.getFullText() as string;
            };
            
            const findTsxTreeItems = (node: SyntaxTreeNode): TreeNode<SyntaxTreeNode> | null => {
                let jsxElementName = "";
                
                const createNode = (title: string, preTitle: string) => {
                    return {
                        title: title,
                        preTitle: preTitle,
                        data: node,
                        canMove: true
                    };
                };
                
                switch (node.type) {
                    case "JsxElement":
                        jsxElementName = getJsxElementNameFromNode(node, "<JSX element>");
                        const syntaxListNodes = node.childNodes.find(n => n.type === "SyntaxList");
                    
                        return {
                            ...createNode(jsxElementName, "</>"),
                            children: syntaxListNodes
                            ? syntaxListNodes.childNodes
                            .map(n => findTsxTreeItems(n))
                            .filter(n => n !== null) as TreeNode[]
                            : []
                        };
                    
                    case "JsxSelfClosingElement":
                        jsxElementName = getJsxElementNameFromNode(node, "<Self-closing JSX element>");
                        return createNode(jsxElementName, "</>");
                    
                    case "JsxText":
                        return node.isEmpty()
                            ? null
                            : createNode(abbreviateJsxElementContent(node), "Abc");
                    
                    case "JsxExpression":
                        return createNode(abbreviateJsxElementContent(node), "{…}");
                    
                    default:
                        return null;
                }
            }
            
            return findTsxTreeItems(pattern.node) as TreeNode;
        }),
        new ProgrammableOutputMapping(arg => {
            const output = arg.output;
            NodeMoveProcesser.processTreeOutput(output, arg.document);
        }),
        Tree.makeProvider<SyntaxTreeNode>(),
        AsideRenderer.makeProvider({
            onlyShowWhenCursorIsInRange: true,
            position: AsideRendererPosition.RightSideOfEditor
        })
    ),





    new SyntacticCodeVisualisationProvider(
        "Regulax expressions (constructor)",
        { languages: ["typescript"] },
        new SyntacticPatternFinder(new SyntaxTreePattern(n => 
            n.type === "NewExpression"
                && n.childNodes[1].parserNode.escapedText === "RegExp"
                && n.childNodes[3].childNodes[0].type === "StringLiteral",
            SKIP_MATCH_DESCENDANTS
        )),
        [],
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
    ),





    new SyntacticCodeVisualisationProvider(
        "Regulax expressions (literal)",
        { languages: ["typescript"] },
        new SyntacticPatternFinder(new SyntaxTreePattern(n => n.type === "RegularExpressionLiteral")),
        [],
        new ProgrammableInputMapping(arg => {
            const regexAsString = arg.pattern.text;
            const lastRegexLiteralSlashIndex = regexAsString.lastIndexOf("/");
            
            const regexBody = regexAsString.slice(1, lastRegexLiteralSlashIndex);
            const regexFlags = regexAsString.slice(lastRegexLiteralSlashIndex + 1);
            
            try {
                return {
                    regex: new RegExp(regexBody, regexFlags),
                    range: arg.pattern.range
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
            
            const regexRange = pattern.node.range;
            editor.replace(regexRange, regex.toString());
            editor.applyEdits();
        }),
        RegexEditor.makeProvider(),
        ButtonPopupRenderer.makeProvider()
    ),





    new SyntacticCodeVisualisationProvider(
        "Vega marks",
        { languages: ["json"] },
        new SyntacticPatternFinder(new SyntaxTreePattern(n =>
            n.type === "Property"
                && (n as PropertyNode).key.value === "mark"
                && (n as PropertyNode).value.type === "Object",
            SKIP_MATCH_DESCENDANTS
        )),
        [],
        new ProgrammableInputMapping(arg => {
            const pattern = (arg.pattern as SyntacticPattern).node as PropertyNode;
            const markProperties = (pattern.value as ObjectNode).properties;

            const style: PlotStyle = {};

            const typeProperty = markProperties.find(property => property.key.value === "type");
            const type = typeProperty ? (typeProperty.value as StringNode).value : undefined;
            style["type"] = type ?? "(missing type)";

            const colorProperty = markProperties.find(property => property.key.value === "color");
            style["color"] = colorProperty
                ? Color.fromCss((colorProperty.value as StringNode).value)!
                : Color.fromCss("#4682b4")!;

            const opacityProperty = markProperties.find(property => property.key.value === "opacity");
            style["opacity"] = opacityProperty
                ? (opacityProperty.value as NumberNode).value
                : 1;

            const filledProperty = markProperties.find(property => property.key.value === "filled");
            style["filled"] = filledProperty
                ? (filledProperty.value as BooleanNode).value
                : type
                    ? ["point", "line", "rule"].includes(type) ? false : true
                    : true;
        
            return {
                style: style,
            };
        }),
        new ProgrammableOutputMapping(arg => {
            const editor = arg.output.editor;
            const propertyNode = (arg.pattern as SyntacticPattern).node as PropertyNode;
            const markProperties = (propertyNode.value as ObjectNode).properties;
            const styleChange = arg.output.data.styleChange as PlotStyle;
            const stylePropertyNamesToVegaPropertyNames: Record<keyof PlotStyle, string | null> = {
                "type": "type",
                "color": "color",
                "filled": "filled",
                "opacity": "opacity",
                "thickness": "thickness",
                "shape": null,
                "horizontal": null
            };

            const changedProperties = Object.keys(styleChange) as (keyof PlotStyle)[];
            const propertiesToInsert: {key: string, value: string}[] = [];

            for (let changedPropertyName of changedProperties) {
                const vegaPropertyName = stylePropertyNamesToVegaPropertyNames[changedPropertyName];
                if (!vegaPropertyName) {
                    break;
                }

                // Get the value of the modified property.
                const newPropertyValue = styleChange[changedPropertyName]!;
                let newJsonPropertyValue = newPropertyValue;

                // Transform the value of the property if needed.
                if (changedPropertyName === "color") {
                    newJsonPropertyValue = (newPropertyValue as Color).css;
                }

                if (typeof newJsonPropertyValue === "string") {
                    newJsonPropertyValue = `"${newJsonPropertyValue}"`;
                }

                // If the property already exists in the JSON, updates its value.
                // Otherwise, add the property to the list of properties that should be added to the 'mark' object.
                const jsonProperty = markProperties.find(property => property.key.value === vegaPropertyName);
                if (jsonProperty) {
                    editor.replace(
                        jsonProperty.value.range,
                        newJsonPropertyValue.toString()
                    );
                }
                else {
                    propertiesToInsert.push({
                        key: vegaPropertyName,
                        value: newJsonPropertyValue.toString()
                    })
                }
            }

            // Insert all the new properties.
            const hasPropertiesToInsert = propertiesToInsert.length > 0;
            if (hasPropertiesToInsert) {
                const concatenatedPropertiesToInsert = propertiesToInsert
                    .map(property => `"${property.key}": ${property.value}`)
                    .join(", ");
    
                const hasMarkProperties =  markProperties.length > 0;
                if (hasMarkProperties) {
                    editor.insert(
                        markProperties[markProperties.length - 1].range.end,
                        `, ${concatenatedPropertiesToInsert}`
                    );
                }
                else {
                    editor.replace(
                        propertyNode.value.range,
                        `{ ${concatenatedPropertiesToInsert} }`
                    );
                }
            }

            editor.applyEdits();
        }),
        PlotStyleEditor.makeProvider(),
        ButtonPopoverRenderer.makeProvider({
            buttonContent: "🎨 edit style"
        })
    ),




    new SyntacticCodeVisualisationProvider(
        "CSS style editor",
        { languages: ["css"] },
        new SyntacticPatternFinder(new SyntaxTreePattern(
            n => n.type === "Rule",
            SKIP_MATCH_DESCENDANTS
        )),
        [],
        new ProgrammableInputMapping(arg => {
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

            const input: StyleInspectorInput = {
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
        new ProgrammableOutputMapping(arg => {
            const output = arg.output as StyleInspectorOutput;
            const document = arg.document;
            const editor = output.editor;
            const styleChange = output.data.styleChange;

            console.log(styleChange)

            // Get the current properties of the CSS rule.
            const blockNode = (arg.pattern as SyntacticPattern).node.childNodes[1];
            const blockCssNode = blockNode.parserNode as Block;

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
        StyleInspector.makeProvider(),
        // ButtonPopoverRenderer.makeProvider({
        //     buttonContent: "Inspect 🎨",
        // })
        AsideRenderer.makeProvider({
            onlyShowWhenCursorIsInRange: true,
            position: AsideRendererPosition.RightSideOfCode,
            positionOffset: 50
        })
    ),
];
