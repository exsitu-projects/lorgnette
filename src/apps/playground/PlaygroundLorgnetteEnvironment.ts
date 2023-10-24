import { Document } from "../../core/documents/Document";
import { LorgnetteEnvironment } from "../../core/lorgnette/LorgnetteEnvironment";
import { ProjectionSpecification } from "../../core/projections/ProjectionSpecification";
import { LANGUAGE_PRESETS } from "../../presets/languages/language-presets";
import { cssPropertyStyleInspectorSpecification } from "../../presets/projections/css-property-style-inspector";
import { testFormSpecification_1, testFormSpecification_2 } from "../../presets/projections/form-tests";
import { hexadecimalColorPickerSpecification } from "../../presets/projections/hexadecimal-color-picker";
import { interactiveMarkdownTableSpecification } from "../../presets/projections/interactive-markdown-table";
import { interactiveTsxTreeSpecification } from "../../presets/projections/interactive-tsx-tree";
import { matplotlibTextPropertySetterConfiguratorSpecification } from "../../presets/projections/matplotlib-text-property-setter-configurator";
import { regexConstructorDiagramSpecification } from "../../presets/projections/regex-constructor-diagram";
import { regexLiteralDiagramSpecification } from "../../presets/projections/regex-literal-diagram";
import { syntacticRgbConstructorColorPickerSpecification } from "../../presets/projections/rgb-constructors-color-picker";
import { seabornBarplotConfiguratorSpecification } from "../../presets/projections/seaborn-barplot-configurator";
import { vegaMarksStyleInspectorSpecification } from "../../presets/projections/vega-marks-style-inspector";
import { RENDERER_PRESETS } from "../../presets/renderers/renderer-presets";
import { USER_INTERFACE_PRESETS } from "../../presets/user-interfaces/user-interfaces-presets";
import { DEFAULT_EXAMPLE } from "./examples/Example";

export class PlaygroundLorgnetteEnvironment extends LorgnetteEnvironment {
    protected get initialDocument() {
        const example = DEFAULT_EXAMPLE;
        const document = new Document(example.language, example.content);
        this.addChangeObserverToDocument(document);
        
        return document;
    }

    protected get initialLanguages() {
        return [...LANGUAGE_PRESETS];
    }

    protected get initialRendererNamesToConfigurableProviders() {
        return new Map(Object.entries(RENDERER_PRESETS));
    }

    protected get initialUserInterfaceNamesToConfigurableProviders() {
        return new Map(Object.entries(USER_INTERFACE_PRESETS));
    }

    protected get initialProjectionSpecificationsToResolve() {
        return [
            // Colour pickers
            hexadecimalColorPickerSpecification,
            syntacticRgbConstructorColorPickerSpecification,

            // Regular expression diagrams
            regexLiteralDiagramSpecification,
            regexConstructorDiagramSpecification,

            // Interactive tables and trees
            interactiveMarkdownTableSpecification,
            interactiveTsxTreeSpecification,

            // Inspectors and configurators
            cssPropertyStyleInspectorSpecification,
            seabornBarplotConfiguratorSpecification,
            matplotlibTextPropertySetterConfiguratorSpecification,
            vegaMarksStyleInspectorSpecification,

            // Miscellaneous
            // testFormSpecification_1,
            // testFormSpecification_2
        ] as ProjectionSpecification[];
    }
}
