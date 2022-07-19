import { ClassOf } from "../../../utilities/types";
import { SyntacticFragment } from "../../fragments/syntactic/SyntacticFragment";
import { InputMapping } from "../../mappings/InputMapping";
import { OutputMapping } from "../../mappings/OutputMapping";
import { UserInterfaceProvider } from "../../user-interfaces/UserInterfaceProvider";
import { Monocle } from "../Monocle";
import { SyntacticMonocleProvider } from "./SyntacticMonocleProvider";
import { Renderer } from "../../renderers/Renderer";
import { Document } from "../../documents/Document";

export class SyntacticMonocle extends Monocle<SyntacticFragment> {
    constructor(
        provider: SyntacticMonocleProvider,
        document: Document,
        fragment: SyntacticFragment,
        inputMapping: InputMapping<SyntacticFragment>,
        outputMapping: OutputMapping<SyntacticFragment>,
        userInterfaceProvider: UserInterfaceProvider,
        renderer: ClassOf<Renderer>
    ) {
        super(
            document,
            provider,
            fragment,
            inputMapping,
            outputMapping,
            userInterfaceProvider,
            renderer
        );

        this.initialise();
    }
}