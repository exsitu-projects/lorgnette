import { Document } from "../../core/documents/Document";
import { Position } from "../../core/documents/Position";
import { getLanguageWithId } from "../../core/languages/Language";
import { Monocle } from "../../core/monocles/Monocle";
import { MonocleEnvironment, MonocleEnvironmentProvider, MonocleEnvironmentProviderProps, MonocleEnvironmentProviderState } from "../../MonocleEnvironment";
import { ArrayMap } from "../../utilities/ArrayMap";
import { VisualStudioCodeExtensionMessenger } from "./VisualStudioCodeExtensionMessenger";

type Props = MonocleEnvironmentProviderProps;
type State = MonocleEnvironmentProviderState;

export interface RuntimeRequest {
    id: number;
    position: { line: number, column: number };
    expression: string;
};

let nextRuntimeRequestId = 0;

export class VisualStudioCodeEditorMonocleEnvironmentProvider extends MonocleEnvironmentProvider {
    private messenger: VisualStudioCodeExtensionMessenger;
    private monoclesToRuntimeRequests: ArrayMap<Monocle, RuntimeRequest>;
    
    constructor(props: Props) {
        super(props);

        this.messenger = new VisualStudioCodeExtensionMessenger();
        this.monoclesToRuntimeRequests = new ArrayMap();
        this.initialiseExtensionMessageHandlers();
    }

    private get runtimeRequests(): RuntimeRequest[] {
        return [...this.monoclesToRuntimeRequests.values];
    }

    private initialiseExtensionMessageHandlers(): void {
        this.messenger.addMessageHandler(
            "set-document",
            message => {
                const language = getLanguageWithId(message.payload.languageId);
                if (!language) {
                    console.warn(`The document cannot be set: there is no language with the ID "${message.payload.languageId}"`);
                    return;
                }

                const document = new Document(language, message.payload.content);
                this.setDocument(document)
            }
        );

        this.messenger.addMessageHandler(
            "set-content",
            message => this.setDocumentContent(message.payload.content)
        );

        this.messenger.addMessageHandler(
            "runtime-response",
            message => console.log("RUNTIME RESPONSE:", message)
        );
    }

    protected onEnvironmentDidChange(environmentChanges: Partial<MonocleEnvironment>): void {
        if (environmentChanges.document) {
            const currentLanguage = this.state.document.language;
            if (environmentChanges.document.language === currentLanguage) {
                this.messenger.sendMessage({
                    type: "set-document",
                    payload: {
                        languageId: this.state.document.language.id,
                        content: this.state.document.content,
                    }
                })
            }
            else {
                this.messenger.sendMessage({
                    type: "set-content",
                    payload: {
                        content: this.state.document.content
                    }
                })
            }
        }

        if (environmentChanges.monocles) {
            // Update the list of runtime requests of each monocle.
            this.monoclesToRuntimeRequests.clear();
            for (let monocle of environmentChanges.monocles) {
                // TODO: actually implement this.
                nextRuntimeRequestId += 1;
                this.monoclesToRuntimeRequests.add(monocle, {
                    id: nextRuntimeRequestId,
                    position: { line: monocle.range.start.row, column: monocle.range.start.column },
                    expression: "aaa" // `${nextRuntimeRequestId}`
                });
            }

            // Send a list of all the runtime requests to the extension.
            this.messenger.sendMessage({
                type: "set-runtime-requests",
                payload: {
                    requests: this.runtimeRequests
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