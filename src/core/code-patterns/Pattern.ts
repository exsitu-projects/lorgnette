import { CodeFragmentType } from "../visualisations/CodeFragmentType";
import { SyntacticPattern } from "./syntactic/SyntacticPattern";
import { TextualPattern } from "./textual/TextualPattern";

export type Pattern<T extends CodeFragmentType = CodeFragmentType> =
    T extends CodeFragmentType.Textual ? TextualPattern :
    T extends CodeFragmentType.Syntactic ? SyntacticPattern :
    never;
