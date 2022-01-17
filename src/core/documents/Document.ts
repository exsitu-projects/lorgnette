import { Observer } from "../../utilities/Observer";
import { Ast } from "../languages/Ast";
import { Language } from "../languages/Language";
import { CodeVisualisation } from "../visualisations/CodeVisualisation";
import { DocumentEditor } from "./DocumentEditor";
import { DocumentRange } from "./DocumentRange";
import { Position } from "./Position";
import { Range } from "./Range";

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
    readonly language: Language;
    private cachedAst: Ast | null;
    private textSplitByLine: string[];
    private changeObservers: Set<Observer<DocumentChangeEvent>>;

    constructor(language: Language, initialContent?: string);
    constructor(language: Language, initialContentSplitByLine?: string[]);
    constructor(language: Language, initialContentPossiblySplitByLine?: string | string[]) {
        this.language = language;
        this.cachedAst = null;
        this.changeObservers = new Set();
        
        // Setup the content of the document.
        this.textSplitByLine = [];
        if (initialContentPossiblySplitByLine) {
            this.textSplitByLine = Array.isArray(initialContentPossiblySplitByLine)
                ? initialContentPossiblySplitByLine
                : splitTextByLine(initialContentPossiblySplitByLine);
        }
    }
    
    get content(): string {
        return this.contentSplitByLine.join("\n");
    }

    get contentSplitByLine(): string[] {
        return [...this.textSplitByLine];
    }

    get range(): DocumentRange {
        const startLine = 0;
        const endLine = this.textSplitByLine.length - 1;

        const startColumn = 0;
        const endColumn = this.textSplitByLine[this.textSplitByLine.length - 1].length - 1;

        const startOffset = 0;
        const endOffset = this.textSplitByLine.reduce((sum, line) => sum + line.length, 0);

        return new DocumentRange(
            this,
            new Position(startLine, startColumn, startOffset),
            new Position(endLine, endColumn, endOffset)
        );
    }

    get canBeParsed(): boolean {
        return this.language.parser !== null;
    }

    // Throw an error if there is no parser/in case of a parsing error.
    get ast(): Ast {
        // If there is a cached AST (up-to-date), use it.
        if (this.cachedAst) {
            return this.cachedAst;
        }

        // If there is no cached AST but one can be computed, create a fresh one (and cache it).
        if (this.canBeParsed) {
            const ast = this.language.parser!.parse(this.content);
            this.cachedAst = ast;

            return ast;
        }

        // If no AST can be computed, throw an error.
        throw new Error(`There is no parser for the language (${this.language.name}) of this document.`);
    }

    get isEmpty(): boolean {
        return this.textSplitByLine.length === 0
            || this.content.trim().length === 0;
    }

    getContentInRange(range: Range): string {
        // Clamp line/column values to ensure they fit in the range of the document.
        const startLineIndex = Math.max(0, range.start.row);
        const endLineIndex = Math.min(this.textSplitByLine.length - 1, range.end.row);

        const startColumnIndex = Math.max(0, range.start.column);
        const endColumnIndex = Math.min(this.textSplitByLine[endLineIndex].length - 1, range.end.column);

        // Get the requested lines, and remove the unnecessary parts in the first and the last lines.
        const lines = this.contentSplitByLine.slice(
            startLineIndex,
            endLineIndex + 1
        );

        if (startLineIndex === endLineIndex) {
            lines[0] = lines[0].slice(startColumnIndex, endColumnIndex);
        }
        else {
            lines[0] = lines[0].slice(startColumnIndex);
            lines[lines.length - 1] = lines[lines.length - 1].slice(0, endColumnIndex);
        }

        return lines.join("\n");
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
        // Invalidate the cached AST.
        this.cachedAst = null;

        // Notify every change observer.
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