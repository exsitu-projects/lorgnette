import { SyntaxTree } from "./SyntaxTree";
import { SyntaxTeeeVisitor } from "./SyntaxTreeVisitor";
import { SyntaxTreeNode } from "./SyntaxTreeNode";

export class SyntaxTreePattern implements SyntaxTeeeVisitor<SyntaxTreeNode[]> {
    private match: (node: SyntaxTreeNode) => boolean;
    private skipDescendants: (node: SyntaxTreeNode) => boolean;

    constructor(
        match: (node: SyntaxTreeNode) => boolean,
        skipDescendants: (node: SyntaxTreeNode) => boolean = () => false
    ) {
        this.match = match;
        this.skipDescendants = skipDescendants;
    }

    visitNode(node: SyntaxTreeNode, matchingNodes: SyntaxTreeNode[]) {
        if (this.match(node)) {
            matchingNodes.push(node);
        }

        return this.skipDescendants(node);
    }

    apply(syntaxTree: SyntaxTree): SyntaxTreeNode[] {
        const matchingNodes: SyntaxTreeNode[] = [];
        syntaxTree.visitWith(this, matchingNodes);

        return matchingNodes;
    }
}