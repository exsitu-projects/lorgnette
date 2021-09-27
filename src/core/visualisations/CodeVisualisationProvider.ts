import { CodeVisualisationType } from "./CodeVisualisationType";
import { SyntacticCodeVisualisationProvider } from "./syntactic/SyntacticCodeVisualisationProvider";
import { TextualCodeVisualisationProvider } from "./textual/TextualCodeVisualisationProvider";

export type CodeVisualisationProvider<T extends CodeVisualisationType = CodeVisualisationType> =
    T extends CodeVisualisationType.Textual ? TextualCodeVisualisationProvider :
    T extends CodeVisualisationType.Syntactic ? SyntacticCodeVisualisationProvider :
    never;
