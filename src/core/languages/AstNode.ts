import { Range } from "../documents/Range";
import { AstVisitor } from "./AstVisitor";

export abstract class AstNode<T = any> {
    abstract readonly type: string;
    abstract readonly range: Range;
    abstract readonly parserNode: T;
    
    abstract get childNodes(): AstNode[];

    visitWith<T>(visitor: AstVisitor<T>, extraData: T) {
        visitor.visitNode(this, extraData);

        for (let node of this.childNodes) {
            node.visitWith(visitor, extraData);
        }
    }
}
