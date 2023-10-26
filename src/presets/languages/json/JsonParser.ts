import nearley from "nearley";
import grammar from "./grammar/json.grammar";
import { Position } from "../../../core/documents/Position";
import { Parser } from "../../../core/languages/Parser";
import { JsonSyntaxTree } from "./JsonSyntaxTree";
import { Document } from "../../../core/documents/Document";

export interface JsonParserContext {
    text: string;
    sourceDocument: Document;
    offsetToPositionConverter: (offset: number) => Position;
}

export class JsonParser implements Parser {
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

    async parse(document: Document): Promise<JsonSyntaxTree> {
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
            console.warn("JSON parser result: ", this.nearleyParser.results);
            throw new Error("The JSON parser returned no result.");
        }
        else {
            const result = results[0];
            if (nbResults > 1) {
                console.warn("The JSON parser returned more than one result; only the first one is going to be used.", results);
            }

            return JsonSyntaxTree.fromNearlyParserResult(result, parsingContext);
        }
    }
}