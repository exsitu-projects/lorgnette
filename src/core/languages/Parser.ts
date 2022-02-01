import { SyntaxTree } from "./SyntaxTree";

export interface Parser {
    parse(text: string): SyntaxTree;
}