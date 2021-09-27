import { TextualPattern } from "../../code-patterns/textual/TextualPattern";
import { Range } from "../../documents/Range";
import { CodeVisualisationType } from "../CodeVisualisationType";
import { TextualSite } from "../../sites/textual/TextualSite";
import { Site } from "../../sites/Site";
import { AbstractCodeVisualisation } from "../AbstractCodeVisualisation";
import { TextualCodeVisualisationProvider } from "./TextualCodeVisualisationProvider";
import { InputMapping } from "../../mappings/InputMapping";
import { OutputMapping } from "../../mappings/OutputMapping";
import { UserInterface } from "../../user-interfaces/UserInterface";
import { Document } from "../../documents/Document";
import { UserInterfaceProvider } from "../../user-interfaces/UserInterfaceProvider";

export class TextualCodeVisualisation extends AbstractCodeVisualisation<
    CodeVisualisationType.Textual
> {
    private currentCodeBinding: {
        document: Document,
        pattern: TextualPattern,
        sites: Site<CodeVisualisationType.Textual>[]
    };
    // readonly pattern: TextualPattern;
    // readonly sites: Site<CodeVisualisationType.Textual>[];
    readonly inputMapping: InputMapping<CodeVisualisationType.Textual>;
    readonly outputMapping: OutputMapping<CodeVisualisationType.Textual> | null;
    readonly userInterface: UserInterface;

    constructor(
        provider: TextualCodeVisualisationProvider,
        document: Document,
        pattern: TextualPattern,
        sites: TextualSite[],
        inputMapping: InputMapping<CodeVisualisationType.Textual>,
        outputMapping: OutputMapping<CodeVisualisationType.Textual> | null,
        userInterfaceProvider: UserInterfaceProvider
    ) {
        super(provider);

        // this.pattern = pattern;
        // this.sites = sites;
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

    get pattern(): TextualPattern {
        return this.currentCodeBinding.pattern;
    }

    get sites(): Site<CodeVisualisationType.Textual>[] {
        return this.currentCodeBinding.sites;
    }

    get range(): Range {
        return this.pattern.range;
    }

    // updateCodeBinding(updatedDocument: Document): void {
    updateCodeBinding(): void {
        // Update the document.
        // this.document = this.document;

        console.log("document", this.document)

        // Update the pattern.
        console.log("old pattern", this.pattern);

        const newPattern = this.provider.patternFinder.updatePattern(
            this.pattern,
            this.document.content
        );
        this.currentCodeBinding.pattern = newPattern;

        console.log("new pattern", this.pattern);
        console.log("old sites", this.sites);


        // Update the pattern.
        const newSites = this.provider.provideSitesForPattern(newPattern);
        this.currentCodeBinding.sites = newSites;

        console.log("new sites", this.sites);
    }
}