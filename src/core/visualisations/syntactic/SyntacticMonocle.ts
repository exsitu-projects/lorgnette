import { ClassOf } from "../../../utilities/types";
import { SyntacticPattern } from "../../code-patterns/syntactic/SyntacticPattern";
import { InputMapping } from "../../mappings/InputMapping";
import { OutputMapping } from "../../mappings/OutputMapping";
import { UserInterfaceProvider } from "../../user-interfaces/UserInterfaceProvider";
import { CodeFragmentType } from "../CodeFragmentType";
import { Monocle } from "../Monocle";
import { SyntacticMonocleProvider } from "./SyntacticMonocleProvider";
import { Renderer } from "../../renderers/Renderer";
import { Document } from "../../documents/Document";

export class SyntacticMonocle extends Monocle<CodeFragmentType.Syntactic> {
    constructor(
        provider: SyntacticMonocleProvider,
        document: Document,
        pattern: SyntacticPattern,
        inputMapping: InputMapping<CodeFragmentType.Syntactic>,
        outputMapping: OutputMapping<CodeFragmentType.Syntactic>,
        userInterfaceProvider: UserInterfaceProvider,
        renderer: ClassOf<Renderer>
    ) {
        super(
            document,
            provider,
            pattern,
            inputMapping,
            outputMapping,
            userInterfaceProvider,
            renderer
        );

        this.initialise();
    }
}