import nearley from "nearley";
import grammar from "./grammar/python.grammar";
import { Position } from "../../../core/documents/Position";
import { Parser } from "../../../core/languages/Parser";
import { PythonSyntaxTree } from "./PythonSyntaxTree";
import { Document } from "../../../core/documents/Document";

export interface PythonParserContext {
    text: string;
    sourceDocument: Document;
    offsetToPositionConverter: (offset: number) => Position;
}

export class PythonParser implements Parser {
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

    async parse(document: Document): Promise<PythonSyntaxTree> {
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
            throw new Error("The Python parser returned no result.");
        }
        else {
            const result = results[0];
            if (nbResults > 1) {
                console.warn("The Python parser returned more than one result; only the first one is going to be used.", results);
            }

            return PythonSyntaxTree.fromNearlyParserResult(result, parsingContext);
        }
    }
}