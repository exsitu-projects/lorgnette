import { CodeVisualisationType } from "../visualisations/CodeVisualisationType";
import { SyntacticPattern } from "./syntactic/SyntacticPattern";
import { TextualPattern } from "./textual/TextualPattern";

export type Pattern<T extends CodeVisualisationType = CodeVisualisationType> =
    T extends CodeVisualisationType.Textual ? TextualPattern :
    T extends CodeVisualisationType.Syntactic ? SyntacticPattern :
    never;
