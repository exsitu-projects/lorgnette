import { SyntaxTreeNode } from "./SyntaxTreeNode";
import { SyntaxTeeeVisitor } from "./SyntaxTreeVisitor";

export abstract class SyntaxTree<N extends SyntaxTreeNode = SyntaxTreeNode> {
    readonly root: N;

    constructor(root: N) {
        this.root = root;
    }

    visitWith<T>(visitor: SyntaxTeeeVisitor<T>, extraData: T) {
        this.root.visitWith(visitor, extraData);
    }
}