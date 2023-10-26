import { Document } from "../documents/Document";
import { DocumentEditor } from "../documents/DocumentEditor";
import { Range } from "../documents/Range";
import { EvaluatorValue, Evaluator } from "./evaluators/Evaluator";
import { TextualEvaluator } from "./evaluators/textual/TextualEvaluator";

export type TemplateSlotKey = string;

export interface TemplateSlotSpecification {
    key: TemplateSlotKey;
    evaluator: Evaluator;
}

export abstract class TemplateSlot {
    readonly sourceDocument: Document;
    readonly key: TemplateSlotKey;
    protected evaluator: Evaluator;
    abstract readonly range: Range;

    constructor(
        sourceDocument: Document,
        key: TemplateSlotKey,
        evaluator?: Evaluator
    ) {
        this.sourceDocument = sourceDocument;
        this.key = key;
        this.evaluator = evaluator ?? new TextualEvaluator();
    }
    
    abstract getText(): string;

    setText(text: string, documentEditor: DocumentEditor): void {
        documentEditor.replace(this.range, text);
    }

    getValue(): EvaluatorValue {
        return this.evaluator.getValueFromSlot(this);
    }

    setValue(newValue: EvaluatorValue, documentEditor: DocumentEditor) {
        this.evaluator.setValueInSlot(this, newValue, documentEditor);
    }
}
