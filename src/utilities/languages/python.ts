import { Document } from "../../core/documents/Document";
import { DocumentEditor } from "../../core/documents/DocumentEditor";
import { Range } from "../../core/documents/Range";
import { ExpressionNode } from "../../core/languages/python/nodes/ExpressionNode";
import { FunctionCallNode } from "../../core/languages/python/nodes/FunctionCallNode";
import { NamedArgumentNode } from "../../core/languages/python/nodes/NamedArgumentNode";
import { StringNode } from "../../core/languages/python/nodes/StringNode";
import { Color } from "../Color";

// Do something if a named argument with (one of) the given names exists.
const processNamedArgument = (
    namedArguments: NamedArgumentNode[],
    nameOrNames: string | string[],
    action: (value: ExpressionNode) => void
): void => {
    const argumentNames = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames];
    const argument = namedArguments.find(argument => argumentNames.includes(argument.name.text));

    if (argument) {
        action(argument.value)
    }
};

// Create a function that calls `processNamedArgument` with predefined parameters to make it easier to use.
type NamedArgumentProcesser = (
    nameOrNames: string | string[],
    action: (value: ExpressionNode) => void
) => void;

export function createNamedArgumentProcesser(namedArguments: NamedArgumentNode[]): NamedArgumentProcesser {
    return (
        nameOrNames: string | string[],
        action: (value: ExpressionNode) => void
    ) => {
        processNamedArgument(namedArguments, nameOrNames, action);
    }
}



// Function to attempt to convert a color from a named argument if its value is a string.
// Perform an action if it succeeds, or do nothing if it fails.
export function convertColorFromExpression(argument: ExpressionNode, action: (color: Color) => void): void {
    try {
        const value = argument.value;
        if (value.is(StringNode)) {
            const color = Color.fromCss(value.content);
            action(color);
        }
    }
    catch (error) {
        // If the color could not be converted, do nothing.
    }
};




export const DELETE_ARGUMENT = Symbol("Delete argument");

/**
 * Create, modify or delete a named argument in the function call.
 * If several names are provided and the argument must be created, the first one will be used.
 * If a `shouldDelete` function is specified, delete the argument if it evaluates to `true`.
 */ 
export function modifyNamedArgument(
    document: Document,
    editor: DocumentEditor,
    functionCallNode: FunctionCallNode,
    nameOrNames: string | string[],
    newValueOrDeleteToken: string | typeof DELETE_ARGUMENT,
    shouldDelete?: (newValue: string) => boolean
): void {
    const positionalArguments = functionCallNode.arguments.positionalArguments;
    const namedArguments = functionCallNode.arguments.namedArguments;
    const allArguments = [...positionalArguments, ...namedArguments];

    const argumentNames = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames];

    const argumentIndex = namedArguments.findIndex(argument => argumentNames.includes(argument.name.text));
    const argument = argumentIndex >= 0 ? namedArguments[argumentIndex] : undefined;
    
    // Index among both the positional and the named arguments.
    const argumentGlobalIndex = argumentIndex + positionalArguments.length;

    const shouldDeleteArgument =
        newValueOrDeleteToken === DELETE_ARGUMENT || (shouldDelete && shouldDelete(newValueOrDeleteToken));

    // Creation and modification.
    if (!shouldDeleteArgument) {
        // Case 1: the argument already exists.
        if (argument) {
            editor.replace(argument.value.range, newValueOrDeleteToken);
        }

        // Case 2: the argument must be created and inserted at the end of the argument list.
        else {
            const newArgumentName = argumentNames[0];
            const newArgumentAsText = `${newArgumentName} = ${newValueOrDeleteToken}`;

            // If there is no other argument, insert the new argument immediately after the opening parenthesis.
            if (allArguments.length === 0) {
                editor.insert(
                    functionCallNode.range.end.shiftBy(0, -1, -1),
                    newArgumentAsText
                );
            }

            // If there is only one other argument, insert a comma and the new argument immediately after that argument.
            else if (allArguments.length === 1) {
                const otherArgument = allArguments[0];
                editor.insert(
                    otherArgument.range.end,
                    `, ${newArgumentAsText}`
                );
            }

            // If there are 2+ other arguments, insert everything that appears in between the last two arguments
            // (to capture the comma and all the whitespace, that may include a line break)
            // and the new argument after the last argument.
            else {
                const lastArgument = allArguments[allArguments.length - 1];
                const secondToLastArgument = allArguments[allArguments.length - 2];
                const rangeOfCommaAndWhitespacePrefix = new Range(secondToLastArgument.range.end, lastArgument.range.start);
                const commaAndWhitespacePrefix = document.getContentInRange(rangeOfCommaAndWhitespacePrefix);

                editor.insert(lastArgument.range.end, `${commaAndWhitespacePrefix}${newArgumentAsText}`);
            }
        }
    }

    // Deletion.
    else {
        // If the argument does not exist, there is nothing to do.
        if (!argument) {
            return;
        }

        let rangeToDeleteStart = argument.range.start;
        let rangeToDeleteEnd = argument.range.end;

        // If there is an argument before, the preceeding comma must be deleted too.
        if (argumentGlobalIndex > 0) {
            const preceedingArgument = allArguments[argumentGlobalIndex - 1];
            rangeToDeleteStart = preceedingArgument.range.end;
        }

        editor.delete(new Range(rangeToDeleteStart, rangeToDeleteEnd));
    }
};



// Create a function that calls `modifyNamedArgument` with predefined parameters to make it easier to use.
type NamedArgumentModifyer = (
    nameOrNames: string | string[],
    newValueOrDeleteToken: string | typeof DELETE_ARGUMENT,
    shouldDelete?: (newValue: string) => boolean
) => void;

export function createNamedArgumentModifyer(
    document: Document,
    editor: DocumentEditor,
    functionCallNode: FunctionCallNode
): NamedArgumentModifyer {
    return (
        nameOrNames: string | string[],
        newValueOrDeleteToken: string | typeof DELETE_ARGUMENT,
        shouldDelete?: (newValue: string) => boolean
    ) => {
        modifyNamedArgument(document, editor, functionCallNode, nameOrNames, newValueOrDeleteToken, shouldDelete);
    }
}
