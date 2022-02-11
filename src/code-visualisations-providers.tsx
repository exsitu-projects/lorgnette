import React from "react";
import { SyntacticPatternFinder } from "./core/code-patterns/syntactic/SyntacticPatternFinder";
import { SyntacticPattern } from "./core/code-patterns/syntactic/SyntacticPattern";
import { SyntaxTreeNode } from "./core/languages/SyntaxTreeNode";
import { SKIP_MATCH_DESCENDANTS, SyntaxTreePattern } from "./core/languages/SyntaxTreePattern";
import { ProgrammableInputMapping } from "./core/mappings/ProgrammableInputMapping";
import { ProgrammableOutputMapping } from "./core/mappings/ProgrammableOutputMapping";
import { Output } from "./core/user-interfaces/color-picker/ColorPicker";
import { RegexEditorProvider } from "./core/user-interfaces/regex-editor/RegexEditorProvider";
import { TreeProvider } from "./core/user-interfaces/tree/TreeProvider";
import { NodeMoveProcesser } from "./core/user-interfaces/tree/utilities/NodeMoveProcesser";
import { SyntacticCodeVisualisationProvider } from "./core/visualisations/syntactic/SyntacticCodeVisualisationProvider";
import { RegexPatternFinder } from "./core/code-patterns/textual/RegexPatternFinder";
import { ProgrammableSiteProvider } from "./core/sites/syntactic/ProgrammableSiteProvider";
import { RangeSiteProvider } from "./core/sites/textual/RangeSiteProvider";
import { RegexSiteProvider } from "./core/sites/textual/RegexSiteProvider";
import { ColorPickerProvider } from "./core/user-interfaces/color-picker/ColorPickerProvider";
import { TextualCodeVisualisationProvider } from "./core/visualisations/textual/TextualCodeVisualisationProvider";
import { Range } from "./core/documents/Range";
import { TreeNode } from "./core/user-interfaces/tree/Tree";
import { PlotStyleEditorProvider } from "./core/user-interfaces/plot-style-editor/PlotStyleEditorProvider";
import { PropertyNode } from "./core/languages/json/nodes/PropertyNode";
import { ObjectNode } from "./core/languages/json/nodes/ObjectNode";
import { StringNode } from "./core/languages/json/nodes/StringNode";
import { PlotStyle } from "./core/user-interfaces/plot-style-editor/PlotStyleEditor";
import { convertCssColorToRgbColor, convertRgbColorToCssColor, RgbColor } from "./utilities/RgbColor";
import { NumberNode } from "./core/languages/json/nodes/NumberNode";
import { BooleanNode } from "./core/languages/json/nodes/BooleanNode";

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
    //     new ColorPickerProvider()
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
        new ColorPickerProvider()
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
    //     new ColorPickerProvider()
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
        new TreeProvider<SyntaxTreeNode>()
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
        new RegexEditorProvider()
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
        new RegexEditorProvider()
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
                ? convertCssColorToRgbColor((colorProperty.value as StringNode).value)!
                : convertCssColorToRgbColor("#4682b4")!;

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
                    newJsonPropertyValue = convertRgbColorToCssColor(newPropertyValue as RgbColor);
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
        new PlotStyleEditorProvider()
    ),
];

