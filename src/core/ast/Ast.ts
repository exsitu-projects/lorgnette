export interface AstVisitor<T = any> {
    visitNode(node: AstNode, extraData: T): void;
}

export abstract class AstNode {
    abstract get childNodes(): AstNode[];

    visitWith<T>(visitor: AstVisitor<T>, extraData: T) {
        visitor.visitNode(this, extraData);

        for (let node of this.childNodes) {
            node.visitWith(visitor, extraData);
        }
    }
}

export class Ast {
    readonly root: AstNode;

    constructor(root: AstNode) {
        this.root = root;
    }

    visitWith<T>(visitor: AstVisitor<T>, extraData: T) {
        this.root.visitWith(visitor, extraData);
    }
}