import { SyntaxTreeNode } from "./SyntaxTreeNode";

export interface SyntaxTeeeVisitor<T = any> {
    visitNode(node: SyntaxTreeNode, extraData: T): void | boolean;
}
