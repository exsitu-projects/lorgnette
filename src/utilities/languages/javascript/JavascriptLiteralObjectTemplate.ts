import { Document } from "../../../core/documents/Document";
import { SyntacticFragment } from "../../../core/fragments/syntactic/SyntacticFragment";
import { NamedArgumentNode } from "../../../core/languages/python/nodes/NamedArgumentNode";
import { SyntaxTreeNode } from "../../../core/languages/SyntaxTreeNode";
import { SyntaxTreePattern } from "../../../core/languages/SyntaxTreePattern";
import { KeyValueListTemplate } from "../../../core/templates/syntactic/KeyValueListTemplate";
import { SyntacticTemplateSlot } from "../../../core/templates/syntactic/SyntacticTemplateSlot";
import { TemplateSettings } from "../../../core/templates/Template";
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

const syntaxTreePattern = new SyntaxTreePattern(node =>
    node.type === "ObjectLiteralExpression"
);

export class JavascriptLiteralObjectTemplate extends KeyValueListTemplate<JavascriptLiteralObjectTemplateSlotSpecification> {
    protected readonly listElementSeparator: string = ", ";

    constructor(
        slotSpecifications: JavascriptLiteralObjectTemplateSlotSpecification[],
        partialSettings: Partial<TemplateSettings> = {}
    ) {
        super(syntaxTreePattern, slotSpecifications, partialSettings);
    }

    protected getListNode(fragment: SyntacticFragment): SyntaxTreeNode {
        return fragment.node.childNodes[1];
    }

    protected getKeyValueNodes(listNode: SyntaxTreeNode): SyntaxTreeNode[] {
        return listNode.childNodes.filter(node =>
            node.type === "PropertyAssignment"
        );
    }

    protected getIndexOfKeyValueNodeWithKey(keyValueNodes: SyntaxTreeNode[], key: string): number {
        return keyValueNodes.findIndex(node =>
            node instanceof NamedArgumentNode &&
            node.name.text === key
        )
    }

    protected provideSlotForKeyValueNode(keyValueNodes: SyntaxTreeNode[], document: Document): SyntacticTemplateSlot[] {
        
        return keyValueNodes
            .map(node => {
                const keyNode = node.childNodes[0];
                const key = keyNode.getTextIn(document);

                const specification = this.slotKeysToSpecifications.get(key);
                if (specification) {
                    const valueNode = node.childNodes[2];
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
        return `{ ${key}: ${valueAsText} }`;
    }

    protected formatListElementAsText(key: string, valueAsText: string): string {
        return `${key}: ${valueAsText}`;
    }
}
