import { CodeVisualisationType } from "../visualisations/CodeVisualisationType";
import { SyntacticSite } from "./syntactic/SyntacticSite";
import { TextualSite } from "./textual/TextualSite";

export type Site<T extends CodeVisualisationType = CodeVisualisationType> =
    T extends CodeVisualisationType.Textual ? TextualSite :
    T extends CodeVisualisationType.Syntactic ? SyntacticSite :
    never;
