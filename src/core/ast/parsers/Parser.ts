import { Ast } from "../Ast";

export abstract class Parser<T extends Ast> {

    constructor() {

    }

    abstract parse(text: string): T;
}