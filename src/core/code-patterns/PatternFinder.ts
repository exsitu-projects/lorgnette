import { Ast } from "../ast/Ast";
import { CodeVisualisationType } from "../visualisations/CodeVisualisationType";
import { Pattern } from "./Pattern";
import { SyntacticPattern } from "./syntactic/SyntacticPattern";
import { TextualPattern } from "./textual/TextualPattern";

type PatternFinderInput<T extends CodeVisualisationType> =
    T extends CodeVisualisationType.Textual ? string :
    T extends CodeVisualisationType.Syntactic ? Ast :
    never;

type PatternFinderOutput<T extends CodeVisualisationType> =
    T extends CodeVisualisationType.Textual ? TextualPattern :
    T extends CodeVisualisationType.Syntactic ? SyntacticPattern :
    never;

export interface PatternFinder<
    T extends CodeVisualisationType,
    I = PatternFinderInput<T>,
    O = Pattern<T>
> {
    type: string;
    apply(input: I): O[];
    updatePattern(pattern: O, input: I): O;
}