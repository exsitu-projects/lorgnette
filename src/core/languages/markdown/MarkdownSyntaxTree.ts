import { SyntaxTree } from "../SyntaxTree";
import { MarkdownParserContext } from "./MarkdownParser";
import { MarkdownSyntaxTreeNode } from "./MarkdownSyntaxTreeNode";

export class MarkdownSyntaxTree extends SyntaxTree<MarkdownSyntaxTreeNode> {
    static fromMarkdownTreeRootNode(parserNode: any, parserContext: MarkdownParserContext): MarkdownSyntaxTree {
        const rootNode = MarkdownSyntaxTreeNode.fromParserNode(parserNode, parserContext);
        return new MarkdownSyntaxTree(rootNode);
    } 
}
