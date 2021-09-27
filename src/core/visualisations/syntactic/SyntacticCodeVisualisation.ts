import { SyntacticPattern } from "../../code-patterns/syntactic/SyntacticPattern";
import { Range } from "../../documents/Range";
import { InputMapping } from "../../mappings/InputMapping";
import { OutputMapping } from "../../mappings/OutputMapping";
import { Site } from "../../sites/Site";
import { SyntacticSite } from "../../sites/syntactic/SyntacticSite";
import { UserInterface } from "../../user-interfaces/UserInterface";
import { AbstractCodeVisualisation } from "../AbstractCodeVisualisation";
import { CodeVisualisationType } from "../CodeVisualisationType";
import { SyntacticCodeVisualisationProvider } from "./SyntacticCodeVisualisationProvider";
import { Document } from "../../documents/Document";
import { UserInterfaceProvider } from "../../user-interfaces/UserInterfaceProvider";

export class SyntacticCodeVisualisation extends AbstractCodeVisualisation<CodeVisualisationType.Syntactic> {
    readonly document: Document;
    readonly pattern: SyntacticPattern;
    readonly sites: Site<CodeVisualisationType.Syntactic>[];
    readonly inputMapping: InputMapping<CodeVisualisationType.Syntactic>;
    readonly outputMapping: OutputMapping<CodeVisualisationType.Syntactic> | null;
    readonly userInterface: UserInterface;

    constructor(
        provider: SyntacticCodeVisualisationProvider,
        document: Document,
        pattern: SyntacticPattern,
        sites: SyntacticSite[],
        inputMapping: InputMapping<CodeVisualisationType.Syntactic>,
        outputMapping: OutputMapping<CodeVisualisationType.Syntactic> | null,
        userInterfaceProvider: UserInterfaceProvider
    ) {
        super(provider);

        this.document = document;
        this.pattern = pattern;
        this.sites = sites;
        this.inputMapping = inputMapping;
        this.outputMapping = outputMapping;
        this.userInterface = userInterfaceProvider.provide(this);
        
        this.initialise();
    }

    get range(): Range {
        // TODO
        throw new Error("Not implemented.");
    }

    updateCodeBinding(): void {
        
    }
}