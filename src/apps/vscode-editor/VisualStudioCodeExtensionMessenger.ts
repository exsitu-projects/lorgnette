import { RawRuntimeRequest } from "../../core/runtime/RuntimeRequest";
import { ArrayMap } from "../../utilities/ArrayMap";
import { vscode } from "./VisualStudioCodeApi";

export type MessageType = string;

export type Message = {
    type: MessageType;
    payload: any;
};

export type IncomingMessage<T extends MessageType = MessageType> = 
    { type: T } & (
        {
            type: "set-document",
            payload: {
                languageId: string;
                content: string;
            }
        } | {
            type: "set-language",
            payload: {
                languageId: string;
            }
        } | {
            type: "set-content",
            payload: {
                content: string;
            }
        } | {
            type: "runtime-response",
            payload: {
                requestId: number;
                content: string;
            }
        }
    )
;

export type OutgoingMessage = {
    type: "editor-ready"
} | {
    type: "set-document",
    payload: {
        languageId: string;
        content: string;
    }
} | {
    type: "set-language",
    payload: {
        languageId: string;
    }
} | {
    type: "set-content",
    payload: {
        content: string;
    }
} | {
    type: "set-runtime-requests",
    payload: {
        requests: RawRuntimeRequest[];
    }
} | {
    type: "save-document"
};

export type MessageHandler<T extends MessageType = MessageType> =
    (message: IncomingMessage<T>) => void | Promise<void>;

export class VisualStudioCodeExtensionMessenger {
    private messageTypesToHandlers: ArrayMap<MessageType, MessageHandler>;

    constructor() {
        this.messageTypesToHandlers = new ArrayMap();
    }

    startListeningForMessages(): void {
        window.addEventListener("message", event => this.handleMessage(event.data));
    }

    sendMessage(message: OutgoingMessage): void {
        console.info("Webview sending message:", message);
        vscode.postMessage(message);
    }

    async handleMessage(message: IncomingMessage): Promise<void> {
        console.info("Webview receiving message:", message);
        const handlers = this.messageTypesToHandlers.getValuesOf(message.type);
        for (let handler of handlers) {
            await handler(message);
        }
    }

    addMessageHandler<T extends MessageType>(type: T, handler: MessageHandler<T>): void {
        this.messageTypesToHandlers.add(type, handler as MessageHandler);
    }
}