import { Parser } from "../Parser";
import { Project, Node, ts } from "ts-morph";
import { Position } from "../../documents/Position";
import { TypescriptAst } from "./TypescriptAst";
import { TypescriptAstNode } from "./TypescriptAstNode";
import { Range } from "../../documents/Range";

export interface TypescriptParserContext {
    text: string;
    offsetToPositionConverter: (offset: number) => Position;
};

export class TypescriptParser implements Parser {
    private project: Project;

    constructor() {
        this.project = new Project({
            useInMemoryFileSystem: true
        });
    }

    parse(text: string): TypescriptAst {
        const sourceFile = this.project.createSourceFile(
            "code-in-editor.tsx",
            text,
            {
                overwrite: true
            }
        );

        const parserContext: TypescriptParserContext = {
            text: text,
            offsetToPositionConverter: Position.getOffsetToPositionConverterForText(text)
        };

        const childNodes = sourceFile.compilerNode.getChildren();
        // const root = new TypescriptAstNode(
        //     "SYNTHETIC_ROOT",
        //     new Range(
        //         parserContext.offsetToPositionConverter(childNodes[0].getStart()),
        //         parserContext.offsetToPositionConverter(childNodes[childNodes.length - 1].getEnd()),
        //     ),
        //     childNodes.map(n => TypescriptAstNode.fromTsMorphNode(n as any, parserContext)),
        //     sourceFile as any
        // );

        const root = TypescriptAstNode.fromTsMorphNode(
            childNodes[0],
            parserContext
        );

        const ast = new TypescriptAst(root);

        return ast;
    }
}