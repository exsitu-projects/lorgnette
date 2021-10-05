import { AstNode } from "./AstNode";
import { AstVisitor } from "./AstVisitor";

export abstract class Ast<N extends AstNode = AstNode> {
    abstract get root(): N;

    visitWith<T>(visitor: AstVisitor<T>, extraData: T) {
        this.root.visitWith(visitor, extraData);
    }
}