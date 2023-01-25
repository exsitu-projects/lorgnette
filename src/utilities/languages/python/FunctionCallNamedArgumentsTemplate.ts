import { Document } from "../../../core/documents/Document";
import { DocumentEditor } from "../../../core/documents/DocumentEditor";
import { Range } from "../../../core/documents/Range";
import { SyntacticFragment } from "../../../core/fragments/syntactic/SyntacticFragment";
import { FunctionCallNode } from "../../../core/languages/python/nodes/FunctionCallNode";
import { NamedArgumentNode } from "../../../core/languages/python/nodes/NamedArgumentNode";
import { SyntaxTreePattern } from "../../../core/languages/SyntaxTreePattern";
import { SyntacticTemplateSlot } from "../../../core/templates/syntactic/SyntacticTemplateSlot";
import { TreePatternTemplate, TreePatternTemplateSlotSpecification, TreePatternTemplateSlotSpecifier } from "../../../core/templates/syntactic/TreePatternTemplate";
import { DELETE_SLOT, TemplateDataValue, TemplateSettings } from "../../../core/templates/Template";
import { TemplateSlotKey } from "../../../core/templates/TemplateSlot";
import { TemplateSlotValuator, TemplateSlotValue } from "../../../core/templates/valuators/TemplateSlotValuator";

export type PythonFunctionCallNamedArgumentsTemplateSlotSpecification = {
    key: TemplateSlotKey;
    valuator: TemplateSlotValuator;
    defaultValue?: TemplateSlotValue;
};

export function createSlotSpecification(
    key: TemplateSlotKey,
    valuator: TemplateSlotValuator,
    defaultValue?: TemplateSlotValue
): PythonFunctionCallNamedArgumentsTemplateSlotSpecification {
    return {
        key: key,
        valuator: valuator,
        ...(defaultValue)
    };
}

export class PythonFunctionCallNamedArgumentsTemplate extends TreePatternTemplate {
    protected slotKeysToSpecifications: Map<TemplateSlotKey, PythonFunctionCallNamedArgumentsTemplateSlotSpecification>;

    constructor(
        functionName: string,
        slotSpecifications: PythonFunctionCallNamedArgumentsTemplateSlotSpecification[],
        partialSettings: Partial<TemplateSettings> = {}
    ) {
        const slotKeysToSpecifications = new Map(
            slotSpecifications.map(specification => [specification.key, specification])
        );

        const pattern = PythonFunctionCallNamedArgumentsTemplate.createSyntaxTreePatternFor(functionName);
        const slotSpecifier = PythonFunctionCallNamedArgumentsTemplate.createSlotSpecifierFor(slotKeysToSpecifications);
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
        const functionCallNode = fragment.node as FunctionCallNode;
        const argumentListNode = functionCallNode.arguments;
        const argumentNodes = argumentListNode.childNodes;
        const nbArguments = argumentNodes.length;

        const specification = this.slotKeysToSpecifications.get(key)!;
        const slotValueAsText = specification.valuator.convertValueToText(value);

        if (nbArguments === 0) {
            const textToInsert = `(${key} = ${slotValueAsText})`;
            documentEditor.replace(argumentListNode.range, textToInsert);
            return;
        }
        
        const lastArgument = argumentNodes[nbArguments - 1];

        const startOfRangeToCopyBeforeInsertion = nbArguments > 1
            ? argumentNodes[nbArguments - 2].range.end
            : argumentListNode.range.start.shiftBy(0, 1, 1);
        const endOfRangeToCopyBeforeInsertion = lastArgument.range.start;
        const rangeToCopyBeforeInsertion = new Range(
            startOfRangeToCopyBeforeInsertion,
            endOfRangeToCopyBeforeInsertion
        );

        const textToInsertBefore = nbArguments > 1
            ? document.getContentInRange(rangeToCopyBeforeInsertion)
            : ", ";

        const startOfRangeToCopyAfterInsertion = lastArgument.range.end;
        const endOfRangeToCopyAfterInsertion = argumentListNode.range.end.shiftBy(0, -1, -1);
        const rangeToCopyAfterInsertion = new Range(
            startOfRangeToCopyAfterInsertion,
            endOfRangeToCopyAfterInsertion
        );

        const textToInsertAfter = document.getContentInRange(rangeToCopyAfterInsertion);

        const textToInsert = `${textToInsertBefore}${key} = ${slotValueAsText}${textToInsertAfter}`;
        documentEditor.replace(rangeToCopyAfterInsertion, textToInsert);
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
        const functionCallNode = fragment.node as FunctionCallNode;
        const argumentListNode = functionCallNode.arguments;
        const argumentNodes = argumentListNode.childNodes;
        const nbArguments = argumentNodes.length;

        // Case 1: there is a single argument.
        if (nbArguments === 1) {
            documentEditor.replace(argumentListNode.range, "()");
        }
        // Case 2: there is more than one argument.
        else {
            const lastArgumentIndex = nbArguments - 1;
            const slotArgumentNodeIndex = argumentNodes.findIndex(node =>
                node instanceof NamedArgumentNode && node.name.text === slot.key
            );
            const slotArgumentNode = argumentNodes[slotArgumentNodeIndex];

            // Case 2.1: The argument to delete is the first argument.
            if (slotArgumentNodeIndex === 0) {
                const secondArgumentNode = argumentNodes[1];
                documentEditor.delete(new Range(
                    argumentListNode.range.start.shiftBy(0, 1, 1),
                    secondArgumentNode.range.start
                ));
            }
            // Case 2.2: The argument to delete is the last argument.
            else if (slotArgumentNodeIndex === lastArgumentIndex) {
                const secondToLastArgumentNode = argumentNodes[lastArgumentIndex - 1];
                documentEditor.delete(new Range(
                    secondToLastArgumentNode.range.end,
                    argumentListNode.range.end.shiftBy(0, -1, -1)
                ));
            }
            // Case 2.3: The argument to delete is neither the first nor the last argument.
            else {
                const previousArgumentNode = argumentNodes[slotArgumentNodeIndex - 1];
                documentEditor.delete(new Range(
                    previousArgumentNode.range.end,
                    slotArgumentNode.range.end
                ));
            }
        }
    }

    static createSlotSpecifierFor(slotKeysToSpecifications: Map<TemplateSlotKey, PythonFunctionCallNamedArgumentsTemplateSlotSpecification>): TreePatternTemplateSlotSpecifier {
        return (fragment, document) => {
            const functionCallNode = fragment.node as FunctionCallNode;
            const namedArgumentNodes = functionCallNode.arguments.namedArguments;

            const slotSpecifications: TreePatternTemplateSlotSpecification[] = [];
            for (let node of namedArgumentNodes) {
                const argumentName = node.name.text;
                const specification = slotKeysToSpecifications.get(argumentName);
                if (specification) {
                    slotSpecifications.push({
                        node: node.value,
                        key: specification.key,
                        valuator: specification.valuator
                    });
                }
            }

            return slotSpecifications;
        };
    }

    static createSyntaxTreePatternFor(functionName: string, skipDescendants: boolean = true): SyntaxTreePattern {
        return new SyntaxTreePattern(
            node =>
                node.type === "FunctionCall" &&
                (node as FunctionCallNode).callee.text === functionName,
            skipDescendants
                ? (_, isMatch) => isMatch
                : false
        )
    }
}
