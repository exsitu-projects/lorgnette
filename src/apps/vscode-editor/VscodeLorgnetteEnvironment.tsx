import { Document } from "../../core/documents/Document";
import { PLAIN_TEXT_LANGUAGE } from "../../core/languages/plain-text";
import { Projection } from "../../core/projections/Projection";
import { RawRuntimeRequest, RuntimeRequest, RuntimeRequestId } from "../../core/runtime/RuntimeRequest";
import { RawRuntimeResponse, RuntimeResponse } from "../../core/runtime/RuntimeResponse";
import { VisualStudioCodeExtensionMessenger } from "./VscodeExtensionMessenger";
import { LorgnetteEnvironment, LorgnetteEnvironmentProps, LorgnetteEnvironmentState } from "../../core/lorgnette/LorgnetteEnvironment";
import { LANGUAGE_PRESETS } from "../../presets/languages/language-presets";
import { RENDERER_PRESETS } from "../../presets/renderers/renderer-presets";
import { USER_INTERFACE_PRESETS } from "../../presets/user-interfaces/user-interfaces-presets";
import { cssPropertyStyleInspectorSpecification } from "../../presets/projections/css-property-style-inspector";
import { hexadecimalColorPickerSpecification } from "../../presets/projections/hexadecimal-color-picker";
import { interactiveMarkdownTableSpecification } from "../../presets/projections/interactive-markdown-table";
import { interactiveTsxTreeSpecification } from "../../presets/projections/interactive-tsx-tree";
import { matplotlibTextPropertySetterConfiguratorSpecification } from "../../presets/projections/matplotlib-text-property-setter-configurator";
import { regexConstructorDiagramSpecification } from "../../presets/projections/regex-constructor-diagram";
import { regexLiteralDiagramSpecification } from "../../presets/projections/regex-literal-diagram";
import { syntacticRgbConstructorColorPickerSpecification } from "../../presets/projections/rgb-constructors-color-picker";
import { seabornBarplotConfiguratorSpecification } from "../../presets/projections/seaborn-barplot-configurator";
import { vegaMarksStyleInspectorSpecification } from "../../presets/projections/vega-marks-style-inspector";
import { runtimePandasDataframeTableSpecification } from "../../presets/projections/runtime-pandas-dataframe-table";
import { runtimeValueTracerSpecification } from "../../presets/projections/runtime-value-tracer";
import { ProjectionSpecification } from "../../core/projections/ProjectionSpecification";

type Props = LorgnetteEnvironmentProps;
type State = LorgnetteEnvironmentState;

export class VscodeLorgnetteEnvironment extends LorgnetteEnvironment {
    private messenger: VisualStudioCodeExtensionMessenger;
    private runtimeRequestIdsToProjectionsAndRequests: Map<RuntimeRequestId, { projection: Projection, request: RuntimeRequest }>;
    
    constructor(props: Props) {
        super(props);

        this.messenger = new VisualStudioCodeExtensionMessenger();
        this.runtimeRequestIdsToProjectionsAndRequests = new Map();
        this.initialiseExtensionMessageHandlers();
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

            // Projections using runtime information
            runtimeValueTracerSpecification,
            runtimePandasDataframeTableSpecification,
        ] as ProjectionSpecification[];
    }

    private get runtimeRequests(): RuntimeRequest[] {
        return [...this.runtimeRequestIdsToProjectionsAndRequests.values()]
            .map(({ request }) => request);
    }

    private get rawRuntimeRequests(): RawRuntimeRequest[] {
        return this.runtimeRequests.map(request => request.raw);
    }

    private initialiseExtensionMessageHandlers(): void {
        this.messenger.addMessageHandler(
            "set-document",
            message => {
                // If there is no language for the given ID, switch to plain text.
                let language = this.getLanguageWithId(message.payload.languageId);
                if (!language) {
                    console.warn(`There is no language for ID "${message.payload.languageId}": the document will be considered as plain text.`);
                    language = PLAIN_TEXT_LANGUAGE;
                }

                const document = new Document(language, message.payload.content);
                this.setDocument(document);
            }
        );

        this.messenger.addMessageHandler(
            "set-content",
            message => this.setDocumentContent(message.payload.content)
        );

        this.messenger.addMessageHandler(
            "runtime-response",
            message => this.processRawRuntimeResponse(message.payload, Date.now())
        );
    }

    private remapRuntimeRequestIdsToProjectionsAndRequests(projections: Projection[]): void {
        this.runtimeRequestIdsToProjectionsAndRequests.clear();

        for (let projection of projections) {
            for (let request of projection.runtimeRequests) {
                this.runtimeRequestIdsToProjectionsAndRequests.set(
                    request.id,
                    { projection: projection, request: request }
                );
            }
        }
    }

    private processRawRuntimeResponse(rawResponse: RawRuntimeResponse, receptionTime: number): void {
        if (!this.runtimeRequestIdsToProjectionsAndRequests.has(rawResponse.requestId)) {
            console.warn("The received runtime response has no matching request:", rawResponse);
            return;
        }

        // Convert the raw response to a standard response.
        const { projection, request } = this.runtimeRequestIdsToProjectionsAndRequests.get(rawResponse.requestId)!;
        const response = RuntimeResponse.fromRawResponse(
            rawResponse,
            request.name,
            receptionTime
        );

        // Dispatch the response to the appropriate projection.
        projection.queueRuntimeResponse(response);
        
        console.info("Dispatched runtime response:", response, projection);
    }

    protected onEnvironmentDidChange(environmentChanges: Partial<State>): void {
        super.onEnvironmentDidChange(environmentChanges);

        if (environmentChanges.document) {
            const currentLanguage = this.state.document.language;
            if (environmentChanges.document.language === currentLanguage) {
                this.messenger.sendMessage({
                    type: "set-document",
                    payload: {
                        languageId: this.state.document.language.id,
                        content: this.state.document.content,
                    }
                });
            }
            else {
                this.messenger.sendMessage({
                    type: "set-content",
                    payload: {
                        content: this.state.document.content
                    }
                });
            }
        }

        if (environmentChanges.projections) {
            // Update the list of runtime requests of each projection.
            this.remapRuntimeRequestIdsToProjectionsAndRequests(environmentChanges.projections);

            // Send a list of all the runtime requests to the extension.
            this.messenger.sendMessage({
                type: "set-runtime-requests",
                payload: {
                    requests: this.rawRuntimeRequests
                }
            });
        }
    }

    componentDidMount() {
        super.componentDidMount();

        this.messenger.startListeningForMessages();
        this.messenger.sendMessage({
            type: "editor-ready"
        });
    }
}