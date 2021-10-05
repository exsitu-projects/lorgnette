import { AstNode } from "../../languages/AstNode";
import { Range } from "../../documents/Range";
import { AbstractPatern } from "../AbstractPattern";

export class SyntacticPattern extends AbstractPatern {
    readonly node: AstNode;

    constructor(text: AstNode) {
        super();
        this.node = text;
    }

    get range(): Range {
        // TODO
        throw new Error("Not implemented");
    }

    get text(): string {
        // TODO
        throw new Error("Not implemented");
    }
}
