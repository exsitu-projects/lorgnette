import { SyntacticPattern } from "../../code-patterns/syntactic/SyntacticPattern";
import { Range } from "../../documents/Range";
import { InputMapping } from "../../mappings/InputMapping";
import { OutputMapping } from "../../mappings/OutputMapping";
import { UserInterface } from "../../user-interfaces/UserInterface";
import { AbstractCodeVisualisation } from "../AbstractCodeVisualisation";
import { CodeVisualisationType } from "../CodeVisualisationType";
import { SyntacticCodeVisualisationProvider } from "./SyntacticCodeVisualisationProvider";
import { Document } from "../../documents/Document";
import { UserInterfaceProvider } from "../../user-interfaces/UserInterfaceProvider";
import { Renderer } from "../../renderers/Renderer";
import { ClassOf } from "../../../utilities/types";

export class SyntacticCodeVisualisation extends AbstractCodeVisualisation<CodeVisualisationType.Syntactic> {
    private currentCodeBinding: {
        document: Document,
        pattern: SyntacticPattern
    };
    readonly inputMapping: InputMapping<CodeVisualisationType.Syntactic>;
    readonly outputMapping: OutputMapping<CodeVisualisationType.Syntactic> | null;
    readonly userInterface: UserInterface;
    readonly renderer: ClassOf<Renderer>;

    constructor(
        provider: SyntacticCodeVisualisationProvider,
        document: Document,
        pattern: SyntacticPattern,
        inputMapping: InputMapping<CodeVisualisationType.Syntactic>,
        outputMapping: OutputMapping<CodeVisualisationType.Syntactic> | null,
        userInterfaceProvider: UserInterfaceProvider,
        renderer: ClassOf<Renderer>
    ) {
        super(provider);

        this.currentCodeBinding = {
            document: document,
            pattern: pattern
        };
        this.inputMapping = inputMapping;
        this.outputMapping = outputMapping;
        this.userInterface = userInterfaceProvider.provide(this);
        this.renderer = renderer;
        
        this.initialise();
    }


    get document(): Document {
        return this.currentCodeBinding.document;
    }

    get pattern(): SyntacticPattern {
        return this.currentCodeBinding.pattern;
    }

    get range(): Range {
        return this.pattern.range;
    }
}