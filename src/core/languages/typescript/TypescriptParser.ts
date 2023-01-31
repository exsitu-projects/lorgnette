import { Parser } from "../Parser";
import { Project } from "ts-morph";
import { Position } from "../../documents/Position";
import { TypescriptSyntaxTree } from "./TypescriptSyntaxTree";
import { TypescriptSyntaxTreeNode } from "./TypescriptSyntaxTreeNode";
import { Document } from "../../documents/Document";

export interface TypescriptParserContext {
    text: string;
    sourceDocument: Document;
    offsetToPositionConverter: (offset: number) => Position;
};

export class TypescriptParser implements Parser {
    private project: Project;

    constructor() {
        this.project = new Project({
            useInMemoryFileSystem: true
        });
    }

    async parse(document: Document): Promise<TypescriptSyntaxTree> {
        const text = document.content;
        const sourceFile = this.project.createSourceFile(
            "code-in-editor.tsx",
            text,
            { overwrite: true }
        );

        const parserContext: TypescriptParserContext = {
            text: text,
            sourceDocument: document,
            offsetToPositionConverter: Position.getOffsetToPositionConverterForText(text)
        };

        const childNodes = sourceFile.compilerNode.getChildren();
        const root = TypescriptSyntaxTreeNode.fromTsMorphNode(
            childNodes[0],
            parserContext
        );

        return new TypescriptSyntaxTree(root);
    }
}