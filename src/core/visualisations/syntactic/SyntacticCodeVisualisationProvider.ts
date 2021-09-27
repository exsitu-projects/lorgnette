import { SyntacticPattern } from "../../code-patterns/syntactic/SyntacticPattern";
import { Document } from "../../documents/Document";
import { SyntacticSite } from "../../sites/syntactic/SyntacticSite";
import { AbstractCodeVisualisationProvider } from "../AbstractCodeVisualisationProvider";
import { CodeVisualisationType } from "../CodeVisualisationType";
import { SyntacticCodeVisualisation } from "./SyntacticCodeVisualisation";

export class SyntacticCodeVisualisationProvider extends AbstractCodeVisualisationProvider<CodeVisualisationType.Syntactic> {
    readonly type = CodeVisualisationType.Syntactic;

    get codeVisualisations(): SyntacticCodeVisualisation[] {
        // TODO
        return [];
    }

    updateFromDocument(document: Document): void {
        // TODO
    }

    provideSitesForPattern(pattern: SyntacticPattern): SyntacticSite[] {
        // TODO
        return [];
    }
}
