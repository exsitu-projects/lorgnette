import { AstNode } from "../languages/AstNode";
import { CodeVisualisationType } from "../visualisations/CodeVisualisationType";
import { SyntacticSite } from "./syntactic/SyntacticSite";
import { TextualSite } from "./textual/TextualSite";

type SiteProviderInput<T extends CodeVisualisationType> =
    T extends CodeVisualisationType.Textual ? string :
    T extends CodeVisualisationType.Syntactic ? AstNode :
    never;

type SiteProviderOutput<T extends CodeVisualisationType> =
    T extends CodeVisualisationType.Textual ? TextualSite | null :
    T extends CodeVisualisationType.Syntactic ? SyntacticSite | null :
    never;

export interface SiteProvider<
    T extends CodeVisualisationType = CodeVisualisationType,
    I = SiteProviderInput<T>,
    O = SiteProviderOutput<T>
> {
    id: string;
    provideForPattern(pattern: I): O;
}