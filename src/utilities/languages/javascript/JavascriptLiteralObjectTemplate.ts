import { Document } from "../../../core/documents/Document";
import { DocumentEditor } from "../../../core/documents/DocumentEditor";
import { Range } from "../../../core/documents/Range";
import { SyntacticFragment } from "../../../core/fragments/syntactic/SyntacticFragment";
import { NamedArgumentNode } from "../../../core/languages/python/nodes/NamedArgumentNode";
import { SKIP_MATCH_DESCENDANTS, SyntaxTreePattern } from "../../../core/languages/SyntaxTreePattern";
import { SyntacticTemplateSlot } from "../../../core/templates/syntactic/SyntacticTemplateSlot";
import { TreePatternTemplate, TreePatternTemplateSlotSpecification, TreePatternTemplateSlotSpecifier } from "../../../core/templates/syntactic/TreePatternTemplate";
import { DELETE_SLOT, TemplateDataValue, TemplateSettings } from "../../../core/templates/Template";
import { TemplateSlotKey } from "../../../core/templates/TemplateSlot";
import { Valuator, ValuatorValue } from "../../../core/templates/valuators/Valuator";

export type JavascriptLiteralObjectTemplateSlotSpecification = {
    key: TemplateSlotKey;
    valuator: Valuator;
    defaultValue?: ValuatorValue;
};

export function createSlotSpecification(
    key: TemplateSlotKey,
    valuator: Valuator,
    defaultValue?: ValuatorValue
): JavascriptLiteralObjectTemplateSlotSpecification {
    return {
        key: key,
        valuator: valuator,
        defaultValue: defaultValue
    };
}

export class JavascriptLiteralObjectTemplate extends TreePatternTemplate {
    protected slotKeysToSpecifications: Map<TemplateSlotKey, JavascriptLiteralObjectTemplateSlotSpecification>;

    constructor(
        slotSpecifications: JavascriptLiteralObjectTemplateSlotSpecification[],
        partialSettings: Partial<TemplateSettings> = {}
    ) {
        const slotKeysToSpecifications = new Map(
            slotSpecifications.map(specification => [specification.key, specification])
        );

        const pattern = JavascriptLiteralObjectTemplate.createSyntaxTreePattern();
        const slotSpecifier = JavascriptLiteralObjectTemplate.createSlotSpecifierFor(slotKeysToSpecifications);
        super(pattern, slotSpecifier, partialSettings);

        this.slotKeysToSpecifications = slotKeysToSpecifications;
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
            && specification.defaultValue !== value;
    }

    protected createSlot(key: string, value: TemplateDataValue, fragment: SyntacticFragment, documentEditor: DocumentEditor, document: Document): void {
        const literalObjectNode = fragment.node.childNodes[1];
        const literalObjectChildNodes = literalObjectNode.childNodes;
        const propertyAssignmentNodes = literalObjectChildNodes.filter(node => node.type === "PropertyAssignment");
        const nbPropertyAssignmentNodes = propertyAssignmentNodes.length;

        const specification = this.slotKeysToSpecifications.get(key)!;
        const slotValueAsText = specification.valuator.convertValueToText(value);

        if (nbPropertyAssignmentNodes === 0) {
            documentEditor.replace(
                literalObjectNode.range,
                `{ ${key}: ${slotValueAsText} }`
            );
        }
        else {
            const lastAssignment = propertyAssignmentNodes[nbPropertyAssignmentNodes - 1];

            const startOfRangeToCopyBeforeInsertion = nbPropertyAssignmentNodes > 1
                ? propertyAssignmentNodes[nbPropertyAssignmentNodes - 2].range.end
                : literalObjectNode.range.start.shiftBy(0, 1, 1);
            const endOfRangeToCopyBeforeInsertion = lastAssignment.range.start;
            const rangeToCopyBeforeInsertion = new Range(
                startOfRangeToCopyBeforeInsertion,
                endOfRangeToCopyBeforeInsertion
            );
    
            const textToInsertBefore = nbPropertyAssignmentNodes > 1
                ? document.getContentInRange(rangeToCopyBeforeInsertion)
                : ", ";
    
            const startOfRangeToCopyAfterInsertion = lastAssignment.range.end;
            const endOfRangeToCopyAfterInsertion = literalObjectNode.range.end.shiftBy(0, -1, -1);
            const rangeToCopyAfterInsertion = new Range(
                startOfRangeToCopyAfterInsertion,
                endOfRangeToCopyAfterInsertion
            );
    
            const textToInsertAfter = document.getContentInRange(rangeToCopyAfterInsertion);

            documentEditor.replace(
                rangeToCopyAfterInsertion,
                `${textToInsertBefore}${key}: ${slotValueAsText}${textToInsertAfter}`
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
        return specification.defaultValue === newValue;
    }

    protected deleteSlot(slot: SyntacticTemplateSlot, newValue: TemplateDataValue, fragment: SyntacticFragment, documentEditor: DocumentEditor): void {
        const literalObjectNode = fragment.node.childNodes[1];
        const literalObjectChildNodes = literalObjectNode.childNodes;
        const propertyAssignmentNodes = literalObjectChildNodes.filter(node => node.type === "PropertyAssignment");
        const nbPropertyAssignmentNodes = propertyAssignmentNodes.length;

        // Case 1: there is a single assignment.
        if (nbPropertyAssignmentNodes === 1) {
            documentEditor.replace(literalObjectNode.range, "()");
        }
        // Case 2: there is more than one assignment.
        else {
            const lastArgumentIndex = nbPropertyAssignmentNodes - 1;
            const slotArgumentNodeIndex = propertyAssignmentNodes.findIndex(node =>
                node instanceof NamedArgumentNode && node.name.text === slot.key
            );
            const slotArgumentNode = propertyAssignmentNodes[slotArgumentNodeIndex];

            // Case 2.1: The assignment to delete is the first assignment.
            if (slotArgumentNodeIndex === 0) {
                const secondArgumentNode = propertyAssignmentNodes[1];
                documentEditor.delete(new Range(
                    literalObjectNode.range.start.shiftBy(0, 1, 1),
                    secondArgumentNode.range.start
                ));
            }
            // Case 2.2: The assignment to delete is the last assignment.
            else if (slotArgumentNodeIndex === lastArgumentIndex) {
                const secondToLastArgumentNode = propertyAssignmentNodes[lastArgumentIndex - 1];
                documentEditor.delete(new Range(
                    secondToLastArgumentNode.range.end,
                    literalObjectNode.range.end.shiftBy(0, -1, -1)
                ));
            }
            // Case 2.3: The assignment to delete is neither the first nor the last assignment.
            else {
                const previousArgumentNode = propertyAssignmentNodes[slotArgumentNodeIndex - 1];
                documentEditor.delete(new Range(
                    previousArgumentNode.range.end,
                    slotArgumentNode.range.end
                ));
            }
        }
    }

    static createSlotSpecifierFor(slotKeysToSpecifications: Map<TemplateSlotKey, JavascriptLiteralObjectTemplateSlotSpecification>): TreePatternTemplateSlotSpecifier {
        return (fragment, document) => {
            const literalObjectNode = fragment.node.childNodes[1];
            const literalObjectChildNodes = literalObjectNode.childNodes;
            const propertyAssignmentNodes = literalObjectChildNodes.filter(
                node => node.type === "PropertyAssignment"
            );

            const slotSpecifications: TreePatternTemplateSlotSpecification[] = [];
            for (let node of propertyAssignmentNodes) {
                const keyNode = node.childNodes[0];
                const key = keyNode.getTextIn(document);
                
                const specification = slotKeysToSpecifications.get(key);
                if (specification) {
                    const valueNode = node.childNodes[2];
                    slotSpecifications.push({
                        node: valueNode,
                        key: specification.key,
                        valuator: specification.valuator
                    });
                }
            }

            return slotSpecifications;
        };
    }

    static createSyntaxTreePattern(skipDescendants: boolean = true): SyntaxTreePattern {
        return new SyntaxTreePattern(
            node =>
                node.type === "ObjectLiteralExpression",
            skipDescendants
                ? SKIP_MATCH_DESCENDANTS
                : false
        )
    }
}
