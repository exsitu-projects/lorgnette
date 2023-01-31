import nearley from "nearley";
import grammar from "./grammar/math.grammar";
import { Position } from "../../documents/Position";
import { Parser } from "../Parser";
import { MathSyntaxTree } from "./MathSyntaxTree";
import { Document } from "../../documents/Document";

export interface MathParserContext {
    text: string;
    sourceDocument: Document;
    offsetToPositionConverter: (offset: number) => Position
};

export class MathParser implements Parser {
    private nearleyParser: nearley.Parser;

    constructor() {
        this.nearleyParser = this.createNewParser();
    }

    private createNewParser(): nearley.Parser {
        return new nearley.Parser(
            nearley.Grammar.fromCompiled(grammar),
            { keepHistory: false }
        );
    }

    async parse(document: Document): Promise<MathSyntaxTree> {
        const text = document.content;
        const offsetToPositionConverter = Position.getOffsetToPositionConverterForText(text);
        const parsingContext = {
            text: text,
            sourceDocument: document,
            offsetToPositionConverter: offsetToPositionConverter
        };

        // The parser must be re-created: no better way to clear what has been fed earlier?
        this.nearleyParser = this.createNewParser();
        this.nearleyParser.feed(text);

        const results = this.nearleyParser.results;
        const nbResults = results.length;

        if (nbResults === 0) {
            console.warn("Math. parser result: ", this.nearleyParser.results);
            throw new Error("The math. parser returned no result.");
        }
        else {
            const result = results[0];
            if (nbResults > 1) {
                console.warn("The math. parser returned more than one result; only the first one is going to be used.", results);
            }

            return MathSyntaxTree.fromNearlyParserResult(result, parsingContext);
        }
    }
}