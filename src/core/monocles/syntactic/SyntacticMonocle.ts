import { ClassOf } from "../../../utilities/types";
import { SyntacticFragment } from "../../fragments/syntactic/SyntacticFragment";
import { InputMapping } from "../../mappings/InputMapping";
import { OutputMapping } from "../../mappings/OutputMapping";
import { UserInterfaceProvider } from "../../user-interfaces/UserInterfaceProvider";
import { Monocle, MonocleState } from "../Monocle";
import { SyntacticMonocleProvider } from "./SyntacticMonocleProvider";
import { Renderer } from "../../renderers/Renderer";
import { Document } from "../../documents/Document";
import { RuntimeRequest } from "../../runtime/RuntimeRequest";

export class SyntacticMonocle extends Monocle<SyntacticFragment> {
    constructor(
        provider: SyntacticMonocleProvider,
        document: Document,
        fragment: SyntacticFragment,
        runtimeRequests: RuntimeRequest[],
        inputMapping: InputMapping<SyntacticFragment>,
        outputMapping: OutputMapping<SyntacticFragment>,
        userInterfaceProvider: UserInterfaceProvider,
        renderer: ClassOf<Renderer>,
        initialState?: MonocleState
    ) {
        super(
            document,
            provider,
            fragment,
            runtimeRequests,
            inputMapping,
            outputMapping,
            userInterfaceProvider,
            renderer,
            initialState
        );
    }
}
