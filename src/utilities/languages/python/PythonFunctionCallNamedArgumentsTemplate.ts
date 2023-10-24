import { Document } from "../../../core/documents/Document";
import { SyntacticFragment } from "../../../core/fragments/syntactic/SyntacticFragment";
import { FunctionCallNode } from "../../../presets/languages/python/nodes/FunctionCallNode";
import { NamedArgumentNode } from "../../../presets/languages/python/nodes/NamedArgumentNode";
import { SyntaxTreeNode } from "../../../core/languages/SyntaxTreeNode";
import { SyntaxTreePattern } from "../../../core/languages/SyntaxTreePattern";
import { KeyValueListTemplate, KeyValueListTemplateSlotSpecification } from "../../../core/templates/syntactic/KeyValueListTemplate";
import { SyntacticTemplateSlot } from "../../../core/templates/syntactic/SyntacticTemplateSlot";
import { TemplateSettings } from "../../../core/templates/Template";
import { evaluateCondition, ValueCondition } from "../../ValueCondition";

export type PythonFunctionCallNamedArgumentsTemplateSlotSpecification = KeyValueListTemplateSlotSpecification;

export abstract class PythonFunctionCallNamedArgumentsTemplate extends KeyValueListTemplate<PythonFunctionCallNamedArgumentsTemplateSlotSpecification> {
    protected listElementSeparator: string = ", ";
    
    constructor(
        slotSpecifications: PythonFunctionCallNamedArgumentsTemplateSlotSpecification[],
        partialSettings: Partial<TemplateSettings> = {}
    ) {
        super(
            slotSpecifications,
            partialSettings
        );
    }

    protected abstract createSyntaxTreePattern(): SyntaxTreePattern;

    protected getKeyValueListNode(fragment: SyntacticFragment): SyntaxTreeNode {
        return (fragment.node as FunctionCallNode).arguments;
    }

    protected getKeyValueNodes(listNode: SyntaxTreeNode): SyntaxTreeNode[] {
        return listNode.childNodes;
    }

    protected getIndexOfKeyValueNodeWithKey(keyValueNodes: SyntaxTreeNode[], key: string): number {
        return keyValueNodes.findIndex(node =>
            node instanceof NamedArgumentNode && node.name.text === key
        );
    }

    protected provideSlotForKeyValueNode(keyValueNodes: SyntaxTreeNode[], document: Document): SyntacticTemplateSlot[] {
        return keyValueNodes
            .filter(node => node instanceof NamedArgumentNode)
            .map(node => {
                const namedArgumentNode = node as NamedArgumentNode;
                const argumentName = namedArgumentNode.name.text;
                const specification = this.slotKeysToSpecifications.get(argumentName);
                if (specification) {
                    return new SyntacticTemplateSlot(
                        namedArgumentNode.value,
                        document,
                        specification.key,
                        specification.evaluator
                    );
                }

                return null;
            })
            .filter(slot => !!slot) as SyntacticTemplateSlot[];
    }

    protected formatSingleElementListAsText(key: string, valueAsText: string): string {
        return `(${key} = ${valueAsText})`;
    }

    protected formatListElementAsText(key: string, valueAsText: string): string {
        return `${key} = ${valueAsText}`;
    }

    static createForFunctionNamed(
        functionNameCondition: ValueCondition<string>,
        slotSpecifications: PythonFunctionCallNamedArgumentsTemplateSlotSpecification[],
        partialSettings: Partial<TemplateSettings> = {}
    ): PythonFunctionCallNamedArgumentsTemplate {
        return new (class extends PythonFunctionCallNamedArgumentsTemplate {
            protected createSyntaxTreePattern(): SyntaxTreePattern {
                return new SyntaxTreePattern(node =>
                    node.type === "FunctionCall" &&
                    evaluateCondition(functionNameCondition, (node as FunctionCallNode).callee.text)
                );
            }
        })(slotSpecifications, partialSettings);
    }
}
