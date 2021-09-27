import { Observer } from "../../utilities/Observer";
import { CodeVisualisation } from "../visualisations/CodeVisualisation";
import { DocumentEditor } from "./DocumentEditor";

function splitTextByLine(text: string): string[] {
    return text.split("\n");
}

export enum DocumentChangeOrigin {
    UserEdit = "User edit",
    CodeVisualisationEdit = "Code visualisation edit"
}

export type DocumentChangeContext = {
    origin: DocumentChangeOrigin.UserEdit;
} | {
    origin: DocumentChangeOrigin.CodeVisualisationEdit;
    visualisation: CodeVisualisation;
    isTransientChange: boolean;
};

export interface DocumentChangeEvent {
    document: Document;
    changeContext: DocumentChangeContext;
}

export class Document {
    private textSplitByLine: string[];
    private changeObservers: Set<Observer<DocumentChangeEvent>>;

    constructor(initialContent?: string);
    constructor(initialContentSplitByLine?: string[]);
    constructor(initialContentPossiblySplitByLine?: string | string[]) {
        this.textSplitByLine = [];
        if (initialContentPossiblySplitByLine) {
            this.textSplitByLine = Array.isArray(initialContentPossiblySplitByLine)
                ? initialContentPossiblySplitByLine
                : splitTextByLine(initialContentPossiblySplitByLine);
        }

        this.changeObservers = new Set();
    }
    
    get content(): string {
        return this.contentSplitByLine.join("\n");
    }

    get contentSplitByLine(): string[] {
        return [...this.textSplitByLine];
    }

    setContent(
        newContent: string,
        changeContext: DocumentChangeContext
    ): void {
        this.textSplitByLine = splitTextByLine(newContent);
        this.declareChange(changeContext);
    }

    setContentSplitByLine(
        newContentSplitByLine: string[],
        changeContext: DocumentChangeContext
    ): void {
        this.textSplitByLine = [...newContentSplitByLine];
        this.declareChange(changeContext);
    }

    createEditor(changeContext: DocumentChangeContext): DocumentEditor {
        return new DocumentEditor(this, changeContext);
    }

    private declareChange(changeContext: DocumentChangeContext): void {
        for (let observer of this.changeObservers.values()) {
            observer.processChange({
                document: this,
                changeContext: changeContext
            });
        }
    }

    addChangeObserver(observer: Observer<DocumentChangeEvent>): void {
        this.changeObservers.add(observer);
    }

    removeChangeObserver(observer: Observer<DocumentChangeEvent>): void {
        this.changeObservers.delete(observer);
    }
}