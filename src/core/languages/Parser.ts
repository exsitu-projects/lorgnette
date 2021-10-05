import { Ast } from "./Ast";

export interface Parser {
    parse(text: string): Ast;
}