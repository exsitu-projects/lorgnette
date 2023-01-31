import { ts } from "ts-morph";
import { Document } from "../../../core/documents/Document";
import { SyntacticFragment } from "../../../core/fragments/syntactic/SyntacticFragment";
import { NamedArgumentNode } from "../../../core/languages/python/nodes/NamedArgumentNode";
import { SyntaxTreeNode } from "../../../core/languages/SyntaxTreeNode";
import { SyntaxTreePattern } from "../../../core/languages/SyntaxTreePattern";
import { KeyValueListTemplate, KeyValueListTemplateSlotSpecification } from "../../../core/templates/syntactic/KeyValueListTemplate";
import { SyntacticTemplateSlot } from "../../../core/templates/syntactic/SyntacticTemplateSlot";
import { TemplateSettings } from "../../../core/templates/Template";
import { evaluateCondition, ValueCondition } from "../../ValueCondition";

export type JavascriptLiteralObjectTemplateSlotSpecification = KeyValueListTemplateSlotSpecification;

export class JavascriptLiteralObjectTemplate extends KeyValueListTemplate<JavascriptLiteralObjectTemplateSlotSpecification> {
    protected readonly listElementSeparator: string = ", ";

    constructor(
        slotSpecifications: JavascriptLiteralObjectTemplateSlotSpecification[],
        partialSettings: Partial<TemplateSettings> = {}
    ) {
        super(slotSpecifications, partialSettings);
    }

    protected createSyntaxTreePattern(): SyntaxTreePattern {
        return new SyntaxTreePattern(node =>
            node.type === "ObjectLiteralExpression"
        );
    }

    protected getKeyValueListNode(fragment: SyntacticFragment): SyntaxTreeNode {
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

    static createForAnyContext(
        slotSpecifications: JavascriptLiteralObjectTemplateSlotSpecification[],
        partialSettings: Partial<TemplateSettings> = {}
    ): JavascriptLiteralObjectTemplate {
        return new JavascriptLiteralObjectTemplate(slotSpecifications, partialSettings);
    }

    static createForAssignmentToVariableNamed(
        variableNameCondition: ValueCondition<string>,
        slotSpecifications: JavascriptLiteralObjectTemplateSlotSpecification[],
        partialSettings: Partial<TemplateSettings> = {}
    ): JavascriptLiteralObjectTemplate {
        return new (class extends JavascriptLiteralObjectTemplate {
            protected createSyntaxTreePattern(): SyntaxTreePattern {
                // TODO: do this differently (avoid using the parser's node).
                return new SyntaxTreePattern(node =>
                    node.type === "VariableDeclaration" &&
                    evaluateCondition(variableNameCondition, (node.childNodes[0].parserNode as ts.Node).getText()) &&
                    node.childNodes[2].type === "ObjectLiteralExpression"
                );
            }
        
            protected getKeyValueListNode(fragment: SyntacticFragment): SyntaxTreeNode {
                return fragment.node.childNodes[2].childNodes[1];
            }
        })(slotSpecifications, partialSettings);
    }

    static createForNthArgumentOfFunctionNamed(
        functionNameCondition: ValueCondition<string>,
        argumentIndex: number,
        slotSpecifications: JavascriptLiteralObjectTemplateSlotSpecification[],
        partialSettings: Partial<TemplateSettings> = {}
    ): JavascriptLiteralObjectTemplate {
        return new (class extends JavascriptLiteralObjectTemplate {
            protected createSyntaxTreePattern(): SyntaxTreePattern {
                // TODO: do this differently (avoid using the parser's node).
                return new SyntaxTreePattern(node =>
                    node.type === "CallExpression" &&
                    evaluateCondition(functionNameCondition, (node.childNodes[0].parserNode as ts.Node).getText()) &&
                    node.childNodes[2].childNodes[2 * argumentIndex].type === "ObjectLiteralExpression"
                );
            }
        
            protected getKeyValueListNode(fragment: SyntacticFragment): SyntaxTreeNode {
                return fragment.node.childNodes[2].childNodes[2 * argumentIndex].childNodes[1];
            }
        })(slotSpecifications, partialSettings);
    }
}
