import { Document } from "../documents/Document";
import { Range } from "../documents/Range";
import { SyntaxTeeeVisitor } from "./SyntaxTreeVisitor";

export abstract class SyntaxTreeNode<T = any> {
    readonly sourceDocument: Document;
    abstract readonly type: string;
    abstract readonly range: Range;
    abstract readonly parserNode: T;

    constructor(sourceDocument: Document) {
        this.sourceDocument = sourceDocument;
    }

    // Note: this method may be overriden to provide text in another way,
    // e.g., by accessing a property of the parser node.
    get text(): string {
        return this.sourceDocument.getContentInRange(this.range);
    }
    
    abstract get childNodes(): SyntaxTreeNode[];

    isEmpty(): boolean {
        return this.range.isEmpty();
    }
    
    visitWith<T>(visitor: SyntaxTeeeVisitor<T>, extraData: T): void {
        const skipDescendants = visitor.visitNode(this, extraData);
        if (skipDescendants) {
            return;
        }

        for (let node of this.childNodes) {
            node.visitWith(visitor, extraData);
        }
    }
}
