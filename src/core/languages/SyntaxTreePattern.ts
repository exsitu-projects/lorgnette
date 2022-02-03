import { SyntaxTree } from "./SyntaxTree";
import { SyntaxTeeeVisitor } from "./SyntaxTreeVisitor";
import { SyntaxTreeNode } from "./SyntaxTreeNode";

export const SKIP_MATCH_DESCENDANTS = (node: SyntaxTreeNode, isMatch: boolean) => isMatch;

export class SyntaxTreePattern implements SyntaxTeeeVisitor<SyntaxTreeNode[]> {
    private match: (node: SyntaxTreeNode) => boolean;

    /**
     * Parameter controlling if the subtree(s) rooted in a certain node should be explored.
     * - If the parameter is set to `false`, all subtrees will be explored.
     * - If the parameter is set to a function, the subtrees of nodes
     *   for which the function evaliates to true will not be explored.
     */
    private skipDescendants: false | ((node: SyntaxTreeNode, isMatch: boolean) => boolean);
    
    constructor(
        match: (node: SyntaxTreeNode) => boolean,
        skipDescendants: false | ((node: SyntaxTreeNode, isMatch: boolean) => boolean) = false
    ) {
        this.match = match;
        this.skipDescendants = skipDescendants;
    }

    visitNode(node: SyntaxTreeNode, matchingNodes: SyntaxTreeNode[]): boolean {
        const isMatch = this.match(node);
        if (isMatch) {
            matchingNodes.push(node);
        }

        return typeof this.skipDescendants === "function"
            ? this.skipDescendants(node, isMatch)
            : this.skipDescendants;
    }

    apply(syntaxTree: SyntaxTree): SyntaxTreeNode[] {
        const matchingNodes: SyntaxTreeNode[] = [];
        syntaxTree.visitWith(this, matchingNodes);

        return matchingNodes;
    }
}