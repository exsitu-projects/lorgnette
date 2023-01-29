import { Document } from "../../../core/documents/Document";
import { SyntacticFragment } from "../../../core/fragments/syntactic/SyntacticFragment";
import { FunctionCallNode } from "../../../core/languages/python/nodes/FunctionCallNode";
import { NamedArgumentNode } from "../../../core/languages/python/nodes/NamedArgumentNode";
import { SyntaxTreeNode } from "../../../core/languages/SyntaxTreeNode";
import { SyntaxTreePattern } from "../../../core/languages/SyntaxTreePattern";
import { KeyValueListTemplate } from "../../../core/templates/syntactic/KeyValueListTemplate";
import { SyntacticTemplateSlot } from "../../../core/templates/syntactic/SyntacticTemplateSlot";
import { TemplateSettings } from "../../../core/templates/Template";
import { TemplateSlotKey } from "../../../core/templates/TemplateSlot";
import { Valuator, ValuatorValue } from "../../../core/templates/valuators/Valuator";
import { evaluateCondition, ValueCondition } from "../../ValueCondition";

export type PythonFunctionCallNamedArgumentsTemplateSlotSpecification = {
    key: TemplateSlotKey;
    valuator: Valuator;
    defaultValue?: ValuatorValue;
};

export function createSlotSpecification(
    key: TemplateSlotKey,
    valuator: Valuator,
    defaultValue?: ValuatorValue
): PythonFunctionCallNamedArgumentsTemplateSlotSpecification {
    return {
        key: key,
        valuator: valuator,
        defaultValue: defaultValue
    };
}

function createSyntaxTreePattern(funtionNameCondition: ValueCondition<string>): SyntaxTreePattern {
    return new SyntaxTreePattern(node =>
        node.type === "FunctionCall" &&
        evaluateCondition(funtionNameCondition, (node as FunctionCallNode).callee.text)
    );
}

export class PythonFunctionCallNamedArgumentsTemplate extends KeyValueListTemplate<PythonFunctionCallNamedArgumentsTemplateSlotSpecification> {
    protected listElementSeparator: string = ", ";
    
    constructor(
        funtionNameCondition: string,
        slotSpecifications: PythonFunctionCallNamedArgumentsTemplateSlotSpecification[],
        partialSettings: Partial<TemplateSettings> = {}
    ) {
        super(
            createSyntaxTreePattern(funtionNameCondition),
            slotSpecifications,
            partialSettings
        );
    }

    protected getListNode(fragment: SyntacticFragment): SyntaxTreeNode {
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
                        specification.valuator
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
}
