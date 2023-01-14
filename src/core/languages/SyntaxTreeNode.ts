import { Document } from "../documents/Document";
import { Range } from "../documents/Range";
import { SyntaxTeeeVisitor } from "./SyntaxTreeVisitor";

export abstract class SyntaxTreeNode<T = any> {
    abstract readonly type: string;
    abstract readonly range: Range;
    abstract readonly parserNode: T;
    
    abstract get childNodes(): SyntaxTreeNode[];

    visitWith<T>(visitor: SyntaxTeeeVisitor<T>, extraData: T): void {
        const skipDescendants = visitor.visitNode(this, extraData);
        if (skipDescendants) {
            return;
        }

        for (let node of this.childNodes) {
            node.visitWith(visitor, extraData);
        }
    }

    isEmpty(): boolean {
        return this.range.isEmpty();
    }

    getTextIn(document: Document): string {
        return document.getContentInRange(this.range);
    }
}
