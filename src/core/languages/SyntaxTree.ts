import { SyntaxTreeNode } from "./SyntaxTreeNode";
import { SyntaxTeeeVisitor } from "./SyntaxTreeVisitor";

export abstract class SyntaxTree<N extends SyntaxTreeNode = SyntaxTreeNode> {
    abstract get root(): N;

    visitWith<T>(visitor: SyntaxTeeeVisitor<T>, extraData: T) {
        this.root.visitWith(visitor, extraData);
    }
}