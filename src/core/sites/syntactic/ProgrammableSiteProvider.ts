import { ProgrammableFunction } from "../../../utilities/ProgrammableFunction";
import { SyntacticPattern } from "../../code-patterns/syntactic/SyntacticPattern";
import { AstNode } from "../../languages/AstNode";
import { CodeVisualisationType } from "../../visualisations/CodeVisualisationType";
import { SiteProvider } from "../SiteProvider";
import { SyntacticSite } from "./SyntacticSite";

export type ProgrammableSiteProviderFunction = (pattern: SyntacticPattern) => AstNode | null;

export class ProgrammableSiteProvider implements SiteProvider<CodeVisualisationType.Syntactic> {
    id: string;
    private programmableFunction: ProgrammableFunction<SyntacticPattern, AstNode | null>;

    constructor(functionBodyOrRef: string | ProgrammableSiteProviderFunction) {
        this.id = "new-site";
        this.programmableFunction = new ProgrammableFunction(functionBodyOrRef);
    }

    provideForPattern(pattern: SyntacticPattern): SyntacticSite | null {
        const nodeOrNothing = this.programmableFunction.call(pattern);
        if (nodeOrNothing === null) {
            return null;
        }
        
        return new SyntacticSite(
            nodeOrNothing,
            pattern
        );
    }
}