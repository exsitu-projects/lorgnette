import "./monaco-editor.css";

import React from "react";
import * as monaco from "monaco-editor";
import Editor, { Monaco, loader } from "@monaco-editor/react";
import { Position } from "../../core/documents/Position";
import { Language } from "../../core/languages/Language";
import { DecoratedRange, DecoratedRangeId } from "../../core/code-editor/DecoratedRange";
import { Document, DocumentChangeOrigin } from "../../core/documents/Document";
import { EMPTY_RANGE, Range } from "../../core/documents/Range";
import { CodeEditor } from "../../core/code-editor/CodeEditor";
import { PLAIN_TEXT_LANGUAGE } from "../../core/languages/plain-text";

// TODO: make what follows work with Vite?

// Set up a function that creates the appropriate worker for the Monaco editor for a given "label".
// Adapted from https://github.com/microsoft/monaco-editor/issues/2605.
// (window as any)["MonacoEnvironment"] = {
//     getWorker: (moduleId: any, label: string) => {
//       switch (label) {
//         // Special editor workers.
//         case "editorWorkerService":
//             return new Worker(new URL("monaco-editor/esm/vs/editor/editor.worker", import.meta.url));

//         // Language service (?) workers.
//         case "css":
//         case "less":
//         case "scss":
//             return new Worker(new URL("monaco-editor/esm/vs/basic-languages/css/css.js", import.meta.url));

//         case "handlebars":
//         case "html":
//             return new Worker(new URL("monaco-editor/esm/vs/language/html/html.worker", import.meta.url));

//         case "python":
//             return new Worker(new URL("monaco-editor/esm/vs/basic-languages/python/python.js", import.meta.url));

//         case "json":
//             return new Worker(new URL("monaco-editor/esm/vs/language/json/json.worker", import.meta.url));

//         case "javascript":
//         case "typescript":
//             return new Worker(new URL("monaco-editor/esm/vs/language/typescript/ts.worker", import.meta.url));

//         default:
//           throw new Error(`The language service worker could not be created: unknown language ID: ${label}`);
//       }
//     },
//   };

// Types of the position, range and selection objects used by the Monaco editor.
export type MonacoPosition = monaco.Position;
export type MonacoRange = monaco.Range;
export type MonacoSelection = monaco.Selection;

// Convert a Monaco editor position to a standard position.
export function convertMonacoPosition(position: MonacoPosition, document: Document): Position {
    const cursorLine = position.lineNumber - 1;
    const cursorColumn = position.column - 1;
    return document.getPositionAtLineAndColumn(cursorLine, cursorColumn);
}

// Convert a Monaco editor range to a standard range.
export function convertMonacoRange(range: MonacoRange, document: Document): Range {
    const startLine = range.startLineNumber - 1;
    const startColumn = range.startColumn - 1;
    const startPosition = document.getPositionAtLineAndColumn(startLine, startColumn);

    const endLine = range.endLineNumber - 1;
    const endColumn = range.endColumn - 1;
    const endPosition = document.getPositionAtLineAndColumn(endLine, endColumn);

    return Range.fromUnsortedPositions(startPosition, endPosition);
}

// Convert a Monaco editor selection to a standard range.
export function convertMonacoSelection(selection: MonacoSelection, document: Document): Range {
    const startLine = selection.startLineNumber - 1;
    const startColumn = selection.startColumn - 1;
    const startPosition = document.getPositionAtLineAndColumn(startLine, startColumn);

    const endLine = selection.endLineNumber - 1;
    const endColumn = selection.endColumn - 1;
    const endPosition = document.getPositionAtLineAndColumn(endLine, endColumn);

    return Range.fromUnsortedPositions(startPosition, endPosition);
}

// Convert a standard position to a Monaco editor position.
export function convertPositionToMonacoPosition(position: Position): MonacoPosition {
    return new monaco.Position(
        position.row - 1,
        position.column - 1
    );  
}

// Convert a standard range to a Monaco editor range.
export function convertRangeToMonacoRange(range: Range): MonacoRange {
    return new monaco.Range(
        range.start.row + 1,
        range.start.column + 1,
        range.end.row + 1,
        range.end.column + 1
    );  
}

// Convert a standard range to a Monaco editor selection.
export function convertRangeToMonacoSelection(range: Range): MonacoSelection {
    return new monaco.Selection(
        range.start.row + 1,
        range.start.column + 1,
        range.end.row + 1,
        range.end.column + 1
    );
}

type Props = {
    document: Document;
    content: string;
    selections?: Range[],
    decorations?: DecoratedRange[];
    onContentChange?: (newContent: string) => void;
    onSelectionChange?: (newSelection: Range) => void;
    onCursorPositionChange?: (newPosition: Position) => void;
    onScrollChange?: (newVisibleRange: Range) => void;
    onLayoutChange?: () => void;
};

type State = {
    document: Document;
    cursorPosition: MonacoPosition | null;
}

export class MonacoEditor extends CodeEditor<Props, State> {
    private document: Document;
    private wrapperRef: React.RefObject<HTMLDivElement>;

    // Flag indicating whether changes in the content of the editor should be notified or not.
    private notifyContentChanges: boolean;

    // References to objects provided by the Monaco editor.
    private monaco: Monaco | null;
    private editor: monaco.editor.IStandaloneCodeEditor | null;

    // List of the decorations currently displayed by the Monaco editor.
    private currentEditorDecorations: monaco.editor.IEditorDecorationsCollection | null;
    
    constructor(props: Props) {
        super(props);

        this.document = new Document(PLAIN_TEXT_LANGUAGE, "Loading...");
        this.wrapperRef = React.createRef();

        this.notifyContentChanges = false;
        
        this.monaco = null;
        this.editor = null;
        this.currentEditorDecorations = null;

        this.state = {
            document: new Document(PLAIN_TEXT_LANGUAGE, "Loading..."),
            cursorPosition: null
        };
    }

    private setDocument(newDocument: Document): void {
        newDocument.addChangeObserver({
            processChange: event => {
                if (event.changeContext.origin === DocumentChangeOrigin.Projection) {
                    this.onDocumentModifiedByProjection();
                }
            }
        });

        // this.setState({ document: newDocument });
        this.document = newDocument;

        this.setLanguage(newDocument.language);
        this.setContent(newDocument.content);
    }

    private setContent(newContent: string, notifyChange: boolean = false): void {
        const model = this.editor?.getModel();
        if (!model) {
            return;
        }

        this.notifyContentChanges = false;
        this.editor?.executeEdits("lorgnette-monaco-editor", [{
            range: model.getFullModelRange(),
            text: newContent
        }]);
        this.notifyContentChanges = true;
    }

    private setLanguage(newLanguage: Language): void {
        const model = this.editor?.getModel();
        if (!model) {
            return;
        }

        this.monaco?.editor?.setModelLanguage(model, newLanguage.id);
    }
    
    private startObservingContentChanges(): void {
        this.editor?.onDidChangeModelContent(event => {
            if (this.props.onContentChange && this.notifyContentChanges) {
                const newContent = this.editor!.getValue();
                this.props.onContentChange(newContent);
            }
        });
    }

    private startObservingSelectionChanges(): void {
        if (!this.editor) {
            return;
        }

        this.editor.onDidChangeCursorSelection(event => {
            if (this.props.onSelectionChange) {
                this.props.onSelectionChange(
                    convertMonacoSelection(event.selection, this.props.document)
                );
            }
        });
    }

    private startObservingCursorPositionChanges(): void {
        this.editor?.onDidChangeCursorPosition(event => {
            if (this.props.onCursorPositionChange) {
                this.props.onCursorPositionChange(
                    convertMonacoPosition(event.position, this.props.document)
                );
            }
        });
    }

    private startObservingScrollChanges(): void {
        this.editor?.onDidScrollChange(event => {
            if (this.props.onScrollChange) {
                const visibleRanges = this.editor?.getVisibleRanges();
                this.props.onScrollChange(
                    visibleRanges && visibleRanges.length > 0
                        ? convertMonacoRange(visibleRanges[0], this.props.document)
                        : EMPTY_RANGE
                );
            }
        });
    }

    private startObservingLayoutChanges(): void {
        this.editor?.onDidLayoutChange(event => {
            if (this.props.onLayoutChange) {
                this.props.onLayoutChange();
            }
        });
    }

    private updateSelections(): void {
        const selections = this.props.selections;
        if (selections !== undefined && selections.length > 0) {
            this.editor?.setSelections(
                selections.map(range => convertRangeToMonacoSelection(range))
            );
        }
    }

    private updateDecorations(): void {
        if (!this.editor) {
            return;
        }

        const decoratedRanges = this.props.decorations;
        if (decoratedRanges !== undefined) {
            const decorations: monaco.editor.IModelDeltaDecoration[] =
                decoratedRanges.map(decoratedRange => {
                    return {
                        range: convertRangeToMonacoRange(decoratedRange.range),
                        options: {
                            className: decoratedRange.className
                        }
                    };
                });

            if (this.currentEditorDecorations) {
                this.currentEditorDecorations.clear();
            }

            this.currentEditorDecorations = this.editor.createDecorationsCollection(decorations);
        } 
    }

    getVisibleRange(): Range {
        if (!this.editor) {
            throw Error("The visible range cannot be retrieved: the editor does not exist.");
        }

        const visibleRanges = this.editor.getVisibleRanges();
        const firstVisibleRange = visibleRanges[0];

        if (!visibleRanges) {
            return EMPTY_RANGE;
        }
        else {
            return convertMonacoRange(firstVisibleRange, this.props.document);
        }
    }

    private get editorElement(): Element {
        const editorWrapperElement = this.wrapperRef.current;
        if (!editorWrapperElement) {
            throw Error("The code editor cannot be retrieved: the ref to the code editor wrapper does not exist.");
        }

        return editorWrapperElement.children[0];
    }

    getEditorBoundingBox(): DOMRect {
        return this.editorElement.getBoundingClientRect();
    }

    getEditorTextAreaBoundingBox(): DOMRect {
        const textAreaElement = this.editorElement.querySelector(".view-lines");
        if (!textAreaElement) {
            throw Error("The text area bounding box cannot be computed: the element does not exist.");
        }

        return textAreaElement.getBoundingClientRect();
    }

    getDecorationElementsWithId(id: DecoratedRangeId): Element[] {
        return [...this.editorElement.getElementsByClassName(`${DecoratedRange.className} ${DecoratedRange.classNameForId(id)}`)];
    }

    private onDocumentModifiedByProjection(): void {
        const newContent = this.props.document.content;
        this.setContent(newContent);
    }

    componentDidUpdate(previousProps: Props) {
        if (this.props.document !== previousProps.document) {
            this.setDocument(this.props.document);
            // this.setContent(this.props.document.content);
        }
        
        if (this.props.decorations !== previousProps.decorations) {
            this.updateDecorations();
        }

        if (this.props.selections !== previousProps.selections) {
            this.updateSelections();
        }
    }

    onEditorDidMount(
        editor: monaco.editor.IStandaloneCodeEditor,
        monaco: Monaco
    ): void {
        this.editor = editor;
        this.monaco = monaco;

        this.startObservingContentChanges();
        this.startObservingCursorPositionChanges();
        this.startObservingSelectionChanges();
        this.startObservingScrollChanges();
        this.startObservingLayoutChanges();

        this.setDocument(this.props.document);
        this.setContent(this.props.document.content);

        this.updateSelections();
        this.updateDecorations();
    }
    
    render() {
        return <div
            className="monaco-editor-wrapper"
            ref={this.wrapperRef}
        >
            <Editor
                className="monaco-editor"
                onMount={(editor, monaco) => {
                    this.onEditorDidMount(editor, monaco);
                    
                    // For now, disable errors in TypeScript.
                    // Adapted from https://stackoverflow.com/a/57044804.
                    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                        noSyntaxValidation: true,
                        noSemanticValidation: true
                    });
                }}
                options={{
                    theme: "light",
                    fontSize: 11,
                    colorDecorators: false
                }}
            />
        </div>;
    }
}
