import { AbstractCodeVisualisation } from "./AbstractCodeVisualisation";
import { CodeVisualisationType } from "./CodeVisualisationType";
import { SyntacticCodeVisualisation } from "./syntactic/SyntacticCodeVisualisation";
import { TextualCodeVisualisation } from "./textual/TextualCodeVisualisation";

export type CodeVisualisation<T extends CodeVisualisationType = CodeVisualisationType> =
    T extends CodeVisualisationType.Textual ? TextualCodeVisualisation :
    T extends CodeVisualisationType.Syntactic ? SyntacticCodeVisualisation :
    AbstractCodeVisualisation<T>;
