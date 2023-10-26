import { Document } from "../../core/documents/Document";
import { LorgnetteEnvironment, LorgnetteEnvironmentProps, LorgnetteEnvironmentState } from "../../core/lorgnette/LorgnetteEnvironment";
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
import { Debouncer } from "../../utilities/tasks/Debouncer";
import { DEFAULT_EXAMPLE } from "./examples/Example";
import { LocalStoreManager } from "./local-store/LocalStoreManager";

export interface PlaygroundLorgnetteEnvironmentProps extends LorgnetteEnvironmentProps {
    useLocalStore?: boolean;
}

export class PlaygroundLorgnetteEnvironment extends LorgnetteEnvironment<PlaygroundLorgnetteEnvironmentProps> {
    protected localStoreManager: LocalStoreManager | undefined;
    
    protected saveDocumentChangesInLocalStore: boolean;
    protected localStoreDocumentChangeDebouncer = new Debouncer(500);
    
    constructor(props: PlaygroundLorgnetteEnvironmentProps) {
        super(props);

        // Document changes should only be saved in the local store after the document has been set
        // from either the local store or the default example, which DO NOT occur in the constructor.
        this.saveDocumentChangesInLocalStore = false;
    }

    protected saveDocumentInLocalStore(document: Document): void {
        const localStoreManager = this.getOrCreateLocalStoreManager();
        localStoreManager.setStore({
            documentLanguageId: document.language.id,
            documentContent: document.content
        });
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

    protected onEnvironmentDidChange(environmentChanges: Partial<LorgnetteEnvironmentState>): void {
        // If the document changed, the new document might have to be stored in the local store.
        if (environmentChanges.document) {
            if (this.saveDocumentChangesInLocalStore) {
                this.localStoreDocumentChangeDebouncer.addTask(
                    () => this.saveDocumentInLocalStore(environmentChanges.document!)
                );
            }
        }
    }

    protected getOrCreateLocalStoreManager(): LocalStoreManager {
        if (!this.localStoreManager) {
            this.localStoreManager = new LocalStoreManager();
        }

        return this.localStoreManager;
    }

    protected getDocumentFromLocalStore(): Document | null {
        const localStoreManager = this.getOrCreateLocalStoreManager();
        const store = localStoreManager.getStore();

        if (!store) {
            return null;
        }

        const languageId = store.documentLanguageId;
        const language = this.getLanguageWithId(languageId);
        if (!language) {
            console.warn(`The document cannot be loaded from the store: there is no language with ID "${languageId}")".}`);
            return null;
        }

        return new Document(language, store.documentContent);
    }
    
    protected setDocumentFromLocalStorageOrUseDefaultExample(): void {
        let document: Document | null = null;

        if (this.props.useLocalStore) {
            const localStoreDocument = this.getDocumentFromLocalStore();
            if (localStoreDocument) {
                document = localStoreDocument;
            }
        }
        
        if (!document) {
            console.info("There is no document in the local store: the initial document is set from the default example.");
            const example = DEFAULT_EXAMPLE;
            document = new Document(example.language, example.content);
        }
        
        this.setDocument(document);
    }

    componentDidMount(): void {
        super.componentDidMount();

        this.setDocumentFromLocalStorageOrUseDefaultExample();
        this.saveDocumentChangesInLocalStore = true;
    }
}
