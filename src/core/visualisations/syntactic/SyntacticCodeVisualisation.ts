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
    private currentCodeBinding: {
        document: Document,
        pattern: SyntacticPattern,
        sites: Site<CodeVisualisationType.Syntactic>[]
    };
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

        this.currentCodeBinding = {
            document: document,
            pattern: pattern,
            sites: sites
        };
        this.inputMapping = inputMapping;
        this.outputMapping = outputMapping;
        this.userInterface = userInterfaceProvider.provide(this);
        
        this.initialise();
    }


    get document(): Document {
        return this.currentCodeBinding.document;
    }

    get pattern(): SyntacticPattern {
        return this.currentCodeBinding.pattern;
    }

    get sites(): Site<CodeVisualisationType.Syntactic>[] {
        return this.currentCodeBinding.sites;
    }

    get range(): Range {
        return this.pattern.range;
    }
}