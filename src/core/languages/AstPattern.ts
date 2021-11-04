import { Ast } from "./Ast";
import { AstVisitor } from "./AstVisitor";
import { AstNode } from "./AstNode";

export class AstPattern implements AstVisitor<AstNode[]> {
    private match: (node: AstNode) => boolean;
    private skipDescendants: (node: AstNode) => boolean;

    constructor(
        match: (node: AstNode) => boolean,
        skipDescendants: (node: AstNode) => boolean = () => false
    ) {
        this.match = match;
        this.skipDescendants = skipDescendants;
    }

    visitNode(node: AstNode, matchingNodes: AstNode[]) {
        if (this.match(node)) {
            matchingNodes.push(node);
        }

        return this.skipDescendants(node);
    }

    apply(ast: Ast): AstNode[] {
        const matchingNodes: AstNode[] = [];
        ast.visitWith(this, matchingNodes);

        return matchingNodes;
    }
}