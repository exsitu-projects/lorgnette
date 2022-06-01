import { SyntacticPattern } from "../core/code-patterns/syntactic/SyntacticPattern";
import { SyntacticPatternFinder } from "../core/code-patterns/syntactic/SyntacticPatternFinder";
import { BooleanNode } from "../core/languages/json/nodes/BooleanNode";
import { NumberNode } from "../core/languages/json/nodes/NumberNode";
import { ObjectNode } from "../core/languages/json/nodes/ObjectNode";
import { PropertyNode } from "../core/languages/json/nodes/PropertyNode";
import { StringNode } from "../core/languages/json/nodes/StringNode";
import { SyntaxTreePattern, SKIP_MATCH_DESCENDANTS } from "../core/languages/SyntaxTreePattern";
import { ProgrammableInputMapping } from "../core/mappings/ProgrammableInputMapping";
import { ProgrammableOutputMapping } from "../core/mappings/ProgrammableOutputMapping";
import { ButtonPopoverRenderer } from "../core/renderers/popover/ButtonPopoverRenderer";
import { PlotStyle, PlotStyleEditor } from "../core/user-interfaces/plot-style-editor/PlotStyleEditor";
import { StyleInspector } from "../core/user-interfaces/style-inspector/StyleInspector";
import { SyntacticCodeVisualisationProvider } from "../core/visualisations/syntactic/SyntacticCodeVisualisationProvider";
import { Color } from "../utilities/Color";

// TODO: implement this provider!
export const vegaMarksStyleInspectorProvider = new SyntacticCodeVisualisationProvider(
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
        return {
            style: {},
        };
    }),
    new ProgrammableOutputMapping(arg => {
        
    }),
    
    StyleInspector.makeProvider(),
    ButtonPopoverRenderer.makeProvider({
        buttonContent: "🎨 edit style"
    })
);





// Note: this is a provider for a first version of the style inspector, called the plot style editor.
// It should be replaced by the visualisation provider defined above.
export const vegaMarksStyleEditorProvider = new SyntacticCodeVisualisationProvider(
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
);
