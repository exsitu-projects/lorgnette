import { TextualPattern } from "../../code-patterns/textual/TextualPattern";
import { Range } from "../../documents/Range";
import { CodeVisualisationType } from "../CodeVisualisationType";
import { AbstractCodeVisualisation } from "../AbstractCodeVisualisation";
import { TextualCodeVisualisationProvider } from "./TextualCodeVisualisationProvider";
import { InputMapping } from "../../mappings/InputMapping";
import { OutputMapping } from "../../mappings/OutputMapping";
import { UserInterface } from "../../user-interfaces/UserInterface";
import { Document } from "../../documents/Document";
import { UserInterfaceProvider } from "../../user-interfaces/UserInterfaceProvider";
import { Renderer } from "../../renderers/Renderer";
import { ClassOf } from "../../../utilities/types";

export class TextualCodeVisualisation extends AbstractCodeVisualisation<
    CodeVisualisationType.Textual
> {
    private currentCodeBinding: {
        document: Document,
        pattern: TextualPattern
    };
    readonly inputMapping: InputMapping<CodeVisualisationType.Textual>;
    readonly outputMapping: OutputMapping<CodeVisualisationType.Textual> | null;
    readonly userInterface: UserInterface;
    readonly renderer: ClassOf<Renderer>;

    constructor(
        provider: TextualCodeVisualisationProvider,
        document: Document,
        pattern: TextualPattern,
        inputMapping: InputMapping<CodeVisualisationType.Textual>,
        outputMapping: OutputMapping<CodeVisualisationType.Textual> | null,
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

    get pattern(): TextualPattern {
        return this.currentCodeBinding.pattern;
    }

    get range(): Range {
        return this.pattern.range;
    }
}