import { Fragment } from "../fragments/Fragment";
import { FragmentProvider } from "../fragments/FragmentProvider";
import { SyntacticFragment } from "../fragments/syntactic/SyntacticFragment";
import { InputMapping } from "../mappings/InputMapping";
import { OutputMapping } from "../mappings/OutputMapping";
import { SyntacticTemplateSlot } from "./syntactic/SyntacticTemplateSlot";
import { TextualTemplateSlot } from "./textual/TextualTemplateSlot";

export interface TemplateData<F extends Fragment = Fragment> {
    slots: F extends SyntacticFragment
        ? TextualTemplateSlot
        : SyntacticTemplateSlot;
}

export interface Template<F extends Fragment = Fragment> {
    fragmentProvider: FragmentProvider<F>;
    inputMapping: InputMapping<F>
    outputMapping: OutputMapping<F>;
}
