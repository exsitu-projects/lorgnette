import { Document } from "../../documents/Document";
import { FragmentProvider } from "../../fragments/FragmentProvider"
import { FragmentType } from "../../fragments/FragmentType";
import { SyntacticFragment } from "../../fragments/syntactic/SyntacticFragment";
import { TreePatternFinder } from "../../fragments/syntactic/TreePatternFinder";
import { SyntaxTreePattern } from "../../languages/SyntaxTreePattern";
import { Template, deriveTemplateSettingsFromDefaults, TemplateSettings } from "../Template"
import { SyntacticTemplateSlot } from "./SyntacticTemplateSlot";

export type TreePatternTemplateSlotProvider =
    (fragment: SyntacticFragment, document: Document) => SyntacticTemplateSlot[];

export abstract class TreePatternTemplate extends Template<SyntacticTemplateSlot, SyntacticFragment, TemplateSettings> {
    protected treePatternFinder: TreePatternFinder;

    constructor(partialSettings: Partial<TemplateSettings> = {}) {
        super(partialSettings, deriveTemplateSettingsFromDefaults);
        this.treePatternFinder = new TreePatternFinder(this.createSyntaxTreePattern());
    }
    protected abstract createSyntaxTreePattern(): SyntaxTreePattern;

    protected abstract provideSlotsForFragment(fragment: SyntacticFragment, document: Document): SyntacticTemplateSlot[];

    protected async provideFragmentsForDocument(document: Document): Promise<SyntacticFragment[]> {
        const fragments = await this.treePatternFinder.provideFragmentsForDocument(document);

        this.fragmentsToKeysToSlots.clear();
        for (let fragment of fragments) {
            const slots = this.provideSlotsForFragment(fragment, document);
            this.fragmentsToKeysToSlots.set(
                fragment,
                new Map(slots.map(slot => [slot.key, slot]))
            );
        }

        return fragments;
    }

    protected getFragmentProvider(): FragmentProvider<SyntacticFragment> {
        return {
            type: FragmentType.Syntactic,
            provideFragmentsForDocument: this.provideFragmentsForDocument.bind(this)
        };
    }
}
