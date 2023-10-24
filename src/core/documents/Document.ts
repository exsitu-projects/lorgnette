import { Observer } from "../../utilities/Observer";
import { SyntaxTree } from "../languages/SyntaxTree";
import { Language } from "../languages/Language";
import { DocumentEditor } from "./DocumentEditor";
import { DocumentPosition } from "./DocumentPosition";
import { DocumentRange } from "./DocumentRange";
import { Position } from "./Position";
import { Range } from "./Range";
import { Projection } from "../projections/Projection";

function splitTextByLine(text: string): string[] {
    return text.split("\n");
}

export enum DocumentChangeOrigin {
    UserEdit = "User edit",
    Projection = "Projection"
}

export type DocumentChangeContext = {
    origin: DocumentChangeOrigin.UserEdit;
} | {
    origin: DocumentChangeOrigin.Projection;
    projection: Projection;
    isTransientChange: boolean;
    preservesProjection: boolean;
};

export interface DocumentChangeEvent {
    document: Document;
    changeContext: DocumentChangeContext;
}

export class Document {
    readonly language: Language;
    private cachedSyntaxTree: SyntaxTree | null;
    private textSplitByLine: string[];
    private changeObservers: Set<Observer<DocumentChangeEvent>>;

    constructor(language: Language, initialContent?: string);
    constructor(language: Language, initialContentSplitByLine?: string[]);
    constructor(language: Language, initialContentPossiblySplitByLine?: string | string[]) {
        this.language = language;
        this.cachedSyntaxTree = null;
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

    get nbCharacters(): number {
        const nbCharactersWithoutNewlines =  this.textSplitByLine.reduce((sum, line) => sum + line.length, 0);
        const nbNewlines = this.textSplitByLine.length - 1;
        return nbCharactersWithoutNewlines + nbNewlines;
    }

    get nbLines(): number {
        return this.textSplitByLine.length;
    }

    get range(): DocumentRange {
        const startLine = 0;
        const endLine = this.textSplitByLine.length - 1;

        const startColumn = 0;
        const endColumn = this.textSplitByLine[this.textSplitByLine.length - 1].length - 1;

        const startOffset = 0;
        const endOffset = this.nbCharacters;

        return new DocumentRange(
            this,
            new Position(startLine, startColumn, startOffset),
            new Position(endLine, endColumn, endOffset)
        );
    }

    get canBeParsed(): boolean {
        return !!this.language.parser;
    }

    // Throw an error if there is no parser/in case of a parsing error.
    get syntaxTree(): Promise<SyntaxTree> {
        // If there is a cached syntax tree (up-to-date), use it.
        if (this.cachedSyntaxTree) {
            return Promise.resolve(this.cachedSyntaxTree);
        }

        // If there is no cached syntax tree but one can be computed, create a fresh one (and cache it).
        if (this.canBeParsed) {
            return this.language.parser!.parse(this)
                .then(syntaxTree => {
                    this.cachedSyntaxTree = syntaxTree;
                    return syntaxTree;
                })
                .catch(error => {
                    throw error;
                });
        }

        // If no syntax tree can be computed, throw an error.
        throw new Error(`There is no parser for the language (${this.language.name}) of this document.`);
    }

    get isEmpty(): boolean {
        return this.textSplitByLine.length === 0
            || this.content.trim().length === 0;
    }

    getPositionAtLineAndColumn(line: number, column: number): DocumentPosition {
        const lines = this.contentSplitByLine.slice(0, line + 1);
        const lastLine = lines.pop();
        const previousLines = lines;

        if (lastLine === undefined) {
            throw new Error(`There is no line at the given line index: ${line}`);
        }

        const offset =
            previousLines.reduce((sum, line) => sum + line.length, 0) + // Content of the lines before
            previousLines.length + // Nb. of newline characters
            lastLine.slice(0, column).length // Nb. of characters on the last line

        return new DocumentPosition(this, line, column, offset);
    }

    getContentInRange(range: Range): string {
        // Clamp line/column values to ensure they fit in the range of the document.
        const startLineIndex = Math.max(0, range.start.row);
        const endLineIndex = Math.min(this.textSplitByLine.length - 1, range.end.row);

        const startColumnIndex = Math.max(0, range.start.column);
        const endColumnIndex = Math.min(this.textSplitByLine[endLineIndex].length, range.end.column);

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

    getContentInLine(line: number): string {
        const nbLines = this.nbLines;
        if (line >= nbLines) {
            throw new Error(`There is no line at the given line index: ${line}`);
        }

        // Every line but the last line ends with a '\n' character (not included in 'textSplitByLine' entries).
        return line === nbLines - 1
            ? this.textSplitByLine[line]
            : this.textSplitByLine[line].concat("\n");
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
        // Invalidate the cached syntax tree.
        this.cachedSyntaxTree = null;

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