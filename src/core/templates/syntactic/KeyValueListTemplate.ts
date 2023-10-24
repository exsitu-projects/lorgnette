import { Document } from "../../../core/documents/Document";
import { DocumentEditor } from "../../../core/documents/DocumentEditor";
import { Range } from "../../../core/documents/Range";
import { SyntacticFragment } from "../../../core/fragments/syntactic/SyntacticFragment";
import { SyntacticTemplateSlot } from "../../../core/templates/syntactic/SyntacticTemplateSlot";
import { TreePatternTemplate } from "../../../core/templates/syntactic/TreePatternTemplate";
import { DELETE_SLOT, TemplateDataValue, TemplateSettings } from "../../../core/templates/Template";
import { TemplateSlotKey } from "../../../core/templates/TemplateSlot";
import { Evaluator, EvaluatorValue } from "../evaluators/Evaluator";
import { evaluateCondition, ValueCondition } from "../../../utilities/ValueCondition";
import { SyntaxTreeNode } from "../../languages/SyntaxTreeNode";

export type KeyValueListTemplateSlotSpecification = {
    key: TemplateSlotKey;
    evaluator: Evaluator;
    defaultValue?: ValueCondition<EvaluatorValue>;
};

export function createSlotSpecification(
    key: TemplateSlotKey,
    evaluator: Evaluator,
    defaultValue?: ValueCondition<EvaluatorValue>
): KeyValueListTemplateSlotSpecification {
    return {
        key: key,
        evaluator: evaluator,
        defaultValue: defaultValue
    };
}

export abstract class KeyValueListTemplate<
    S extends KeyValueListTemplateSlotSpecification = KeyValueListTemplateSlotSpecification
> extends TreePatternTemplate {
    protected slotKeysToSpecifications: Map<TemplateSlotKey, S>;
    
    protected readonly abstract listElementSeparator: string;

    constructor(
        slotSpecifications: S[],
        partialSettings: Partial<TemplateSettings> = {}
    ) {
        super(partialSettings);
        this.slotKeysToSpecifications = new Map(
            slotSpecifications.map(specification => [specification.key, specification])
        );
    }

    protected abstract getKeyValueListNode(fragment: SyntacticFragment): SyntaxTreeNode;
    protected abstract getKeyValueNodes(keyValueListNode: SyntaxTreeNode): SyntaxTreeNode[];
    protected abstract getIndexOfKeyValueNodeWithKey(keyValueNodes: SyntaxTreeNode[], key: string): number;
    protected abstract provideSlotForKeyValueNode(keyValueNodes: SyntaxTreeNode[], document: Document): SyntacticTemplateSlot[];

    protected abstract formatSingleElementListAsText(key: string, valueAsText: string): string;
    protected abstract formatListElementAsText(key: string, valueAsText: string): string;

    protected provideSlotsForFragment(fragment: SyntacticFragment, document: Document): SyntacticTemplateSlot[] {
        const keyValueListNode = this.getKeyValueListNode(fragment);
        const keyValueNodes = this.getKeyValueNodes(keyValueListNode);
        return this.provideSlotForKeyValueNode(keyValueNodes, document);
    }

    // Create slots when the value is different from their default value,
    // or when they do not have a default value.
    protected shouldCreateSlot(
        key: string,
        value: TemplateDataValue
    ): boolean {
        if (value === DELETE_SLOT) {
            return false;
        }
        
        const specification = this.slotKeysToSpecifications.get(key);
        return specification !== undefined
            && !evaluateCondition(specification.defaultValue, value);
    }

    protected createSlot(key: string, value: TemplateDataValue, fragment: SyntacticFragment, documentEditor: DocumentEditor, document: Document): void {
        const keyValueListNode = this.getKeyValueListNode(fragment);
        const keyValueNodes = this.getKeyValueNodes(keyValueListNode);
        const nbKeyValueNodes = keyValueNodes.length;

        const specification = this.slotKeysToSpecifications.get(key)!;
        const slotValueAsText = specification.evaluator.convertValueToText(value);


        // Case 1: there is a single key-value pair.
        if (nbKeyValueNodes === 0) {
            documentEditor.replace(
                keyValueListNode.range,
                this.formatSingleElementListAsText(key, slotValueAsText)
            );
        }
        // Case 2: there is more than one key-value pair.
        else {
            const lastAssignment = keyValueNodes[nbKeyValueNodes - 1];

            const startOfRangeToCopyBeforeInsertion = nbKeyValueNodes > 1
                ? keyValueNodes[nbKeyValueNodes - 2].range.end
                : keyValueListNode.range.start.shiftBy(0, 1, 1);
            const endOfRangeToCopyBeforeInsertion = lastAssignment.range.start;
            const rangeToCopyBeforeInsertion = new Range(
                startOfRangeToCopyBeforeInsertion,
                endOfRangeToCopyBeforeInsertion
            );
    
            const textToInsertBefore = nbKeyValueNodes > 1
                ? document.getContentInRange(rangeToCopyBeforeInsertion)
                : this.listElementSeparator;
    
            const startOfRangeToCopyAfterInsertion = lastAssignment.range.end;
            const endOfRangeToCopyAfterInsertion = keyValueListNode.range.end.shiftBy(0, -1, -1);
            const rangeToCopyAfterInsertion = new Range(
                startOfRangeToCopyAfterInsertion,
                endOfRangeToCopyAfterInsertion
            );
    
            const textToInsertAfter = document.getContentInRange(rangeToCopyAfterInsertion);

            const listElementAsText = this.formatListElementAsText(key, slotValueAsText);
            documentEditor.replace(
                rangeToCopyAfterInsertion,
                `${textToInsertBefore}${listElementAsText}${textToInsertAfter}`
            );
        }
    }

    // Delete slots when the new value is equal from their default value.
    protected shouldDeleteSlot(
        slot: SyntacticTemplateSlot,
        newValue: TemplateDataValue
    ): boolean {
        if (newValue === DELETE_SLOT) {
            return true;
        }

        const specification = this.slotKeysToSpecifications.get(slot.key)!;
        return evaluateCondition(specification.defaultValue, newValue);
    }

    protected deleteSlot(slot: SyntacticTemplateSlot, newValue: TemplateDataValue, fragment: SyntacticFragment, documentEditor: DocumentEditor): void {
        const keyValueListNode = this.getKeyValueListNode(fragment);
        const keyValueNodes = this.getKeyValueNodes(keyValueListNode);
        const nbKeyValueNodes = keyValueNodes.length;

        // Case 1: there is a single key-value pair.
        if (nbKeyValueNodes === 1) {
            documentEditor.replace(keyValueListNode.range, "()");
        }
        // Case 2: there is more than one key-value pair.
        else {
            const lastKeyValueNodeIndex = nbKeyValueNodes - 1;
            const slotKeyValueNodeIndex = this.getIndexOfKeyValueNodeWithKey(keyValueNodes, slot.key);
            const slotKeyValueNode = keyValueNodes[slotKeyValueNodeIndex];

            // Case 2.1: The key-value pair to delete is the first key-value pair.
            if (slotKeyValueNodeIndex === 0) {
                const secondKeyValueNode = keyValueNodes[1];
                documentEditor.delete(new Range(
                    keyValueListNode.range.start.shiftBy(0, 1, 1),
                    secondKeyValueNode.range.start
                ));
            }
            // Case 2.2: The key-value pair to delete is the last key-value pair.
            else if (slotKeyValueNodeIndex === lastKeyValueNodeIndex) {
                const secondToLastKeyValueNode = keyValueNodes[lastKeyValueNodeIndex - 1];
                documentEditor.delete(new Range(
                    secondToLastKeyValueNode.range.end,
                    keyValueListNode.range.end.shiftBy(0, -1, -1)
                ));
            }
            // Case 2.3: The key-value pair to delete is neither the first nor the last key-value pair.
            else {
                const previousKeyValueNode = keyValueNodes[slotKeyValueNodeIndex - 1];
                documentEditor.delete(new Range(
                    previousKeyValueNode.range.end,
                    slotKeyValueNode.range.end
                ));
            }
        }
    }
}
