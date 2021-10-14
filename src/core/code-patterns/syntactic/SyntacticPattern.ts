import { AstNode } from "../../languages/AstNode";
import { Range } from "../../documents/Range";
import { AbstractPatern } from "../AbstractPattern";

export class SyntacticPattern extends AbstractPatern {
    readonly node: AstNode;

    constructor(node: AstNode) {
        super();
        this.node = node;
    }

    get range(): Range {
        return this.node.range;
    }

    get text(): string {
        // TODO
        throw new Error("Not implemented");
    }
}
