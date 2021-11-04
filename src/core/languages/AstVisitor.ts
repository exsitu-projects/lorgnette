import { AstNode } from "./AstNode";

export interface AstVisitor<T = any> {
    visitNode(node: AstNode, extraData: T): void | boolean;
}
