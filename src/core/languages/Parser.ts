import { SyntaxTree } from "./SyntaxTree";

export interface Parser {
    parse(text: string): Promise<SyntaxTree>;
}