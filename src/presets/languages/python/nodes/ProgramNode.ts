import { Range } from "../../../../core/documents/Range";
import { PythonSyntaxTreeNode } from "../PythonSyntaxTreeNode";
import { PythonParserContext } from "../PythonParser";
import { convertParserNode } from "../PythonSyntaxTree";
import { ExpressionNode } from "./ExpressionNode";
import { Document } from "../../../../core/documents/Document";

export type InstructionNode =
    | ExpressionNode;

export class ProgramNode extends PythonSyntaxTreeNode {
    static readonly type = "Program";
    readonly type = ProgramNode.type;

    readonly instructions: InstructionNode[];

    constructor(
        instructions: InstructionNode[],
        parserNode: any,
        range: Range,
        sourceDocument: Document
    ) {
        super(parserNode, range, sourceDocument);
        this.instructions = instructions;
    }

    get childNodes(): PythonSyntaxTreeNode[] {
        return [...this.instructions];
    }

    static fromNearlyParserResultNode(node: any, parserContext: PythonParserContext): ProgramNode {
        return new ProgramNode(
            node.instructions.map((n: any) => convertParserNode(n, parserContext)),
            node,
            ProgramNode.computeRangeFromParserNode(node, parserContext),
            parserContext.sourceDocument
        );
    }
}