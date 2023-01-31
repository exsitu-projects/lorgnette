import { Document } from "../documents/Document";
import { SyntaxTree } from "./SyntaxTree";

export interface Parser {
    parse(document: Document): Promise<SyntaxTree>;
}