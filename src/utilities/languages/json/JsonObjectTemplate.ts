import { Document } from "../../../core/documents/Document";
import { SyntacticFragment } from "../../../core/fragments/syntactic/SyntacticFragment";
import { PropertyNode } from "../../../core/languages/json/nodes/PropertyNode";
import { SyntaxTreeNode } from "../../../core/languages/SyntaxTreeNode";
import { SyntaxTreePattern } from "../../../core/languages/SyntaxTreePattern";
import { KeyValueListTemplate, KeyValueListTemplateSlotSpecification } from "../../../core/templates/syntactic/KeyValueListTemplate";
import { SyntacticTemplateSlot } from "../../../core/templates/syntactic/SyntacticTemplateSlot";
import { TemplateSettings } from "../../../core/templates/Template";
import { evaluateCondition, ValueCondition } from "../../ValueCondition";

export type JsonObjectTemplateSlotSpecification = KeyValueListTemplateSlotSpecification;

export class JsonObjectTemplate extends KeyValueListTemplate {
    protected readonly listElementSeparator: string = ", ";

    constructor(
        slotSpecifications: JsonObjectTemplateSlotSpecification[],
        partialSettings: Partial<TemplateSettings> = {}
    ) {
        super(slotSpecifications, partialSettings);
    }

    protected createSyntaxTreePattern(): SyntaxTreePattern {
        return new SyntaxTreePattern(node =>
            node.type === "Object"
        );
    }

    protected getKeyValueListNode(fragment: SyntacticFragment): SyntaxTreeNode {
        return fragment.node.childNodes[1];
    }

    protected getKeyValueNodes(listNode: SyntaxTreeNode): SyntaxTreeNode[] {
        return listNode.childNodes;
    }

    protected getIndexOfKeyValueNodeWithKey(keyValueNodes: SyntaxTreeNode[], key: string): number {
        return keyValueNodes.findIndex(node =>
            (node as PropertyNode).key.value === key
        )
    }

    protected provideSlotForKeyValueNode(keyValueNodes: SyntaxTreeNode[], document: Document): SyntacticTemplateSlot[] {
        return (keyValueNodes as PropertyNode[])
            .map(node => {
                const key = node.key.value;
                const specification = this.slotKeysToSpecifications.get(key);
                if (specification) {
                    const valueNode = node.value;
                    return new SyntacticTemplateSlot(
                        valueNode,
                        document,
                        specification.key,
                        specification.valuator
                    );
                }

                return null;
            })
            .filter(slot => !!slot) as SyntacticTemplateSlot[];
    }

    protected formatSingleElementListAsText(key: string, valueAsText: string): string {
        return `{ "${key}": ${valueAsText} }`;
    }

    protected formatListElementAsText(key: string, valueAsText: string): string {
        return `"${key}": ${valueAsText}`;
    }

    static createForAnyContext(
        slotSpecifications: JsonObjectTemplateSlotSpecification[],
        partialSettings: Partial<TemplateSettings> = {}
    ): JsonObjectTemplate {
        return new JsonObjectTemplate(slotSpecifications, partialSettings);
    }

    static createForAssignmentToKeyNamed(
        keyNameCondition: ValueCondition<string>,
        slotSpecifications: JsonObjectTemplateSlotSpecification[],
        partialSettings: Partial<TemplateSettings> = {}
    ): JsonObjectTemplate {
        return new (class extends JsonObjectTemplate {
            protected createSyntaxTreePattern(): SyntaxTreePattern {
                return new SyntaxTreePattern(node =>
                    node instanceof PropertyNode &&
                    evaluateCondition(keyNameCondition, node.key.value) &&
                    node.value.type === "Object"
                );
            }
        
            protected getKeyValueListNode(fragment: SyntacticFragment): SyntaxTreeNode {
                return (fragment.node as PropertyNode).value;
            }
        })(slotSpecifications, partialSettings);
    }
}
