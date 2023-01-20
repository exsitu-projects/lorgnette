import { Document } from "../../documents/Document";
import { FragmentProvider } from "../../fragments/FragmentProvider"
import { SyntacticFragment } from "../../fragments/syntactic/SyntacticFragment";
import { TreePatternFinder } from "../../fragments/syntactic/TreePatternFinder";
import { SyntaxTreeNode } from "../../languages/SyntaxTreeNode";
import { SyntaxTreePattern } from "../../languages/SyntaxTreePattern";
import { Template, deriveTemplateSettingsFromDefaults, TemplateSettings } from "../Template"
import { TemplateSlot, TemplateSlotKey } from "../TemplateSlot";
import { TemplateSlotValuatorProvider } from "../valuators/TemplateSlotValuatorProvider";
import { SyntacticTemplateSlot } from "./SyntacticTemplateSlot";

export interface TreePatternTemplateSlotSpecification {
    node: SyntaxTreeNode;
    key: TemplateSlotKey;
    valuatorProvider: TemplateSlotValuatorProvider;
}

export type TreePatternTemplateSlotSpecifier =
    (fragment: SyntacticFragment, document: Document) => TreePatternTemplateSlotSpecification[];

export class TreePatternTemplate extends Template<SyntacticFragment, TemplateSettings> {
    protected treePatternFinder: TreePatternFinder;
    protected slotSpecifier: TreePatternTemplateSlotSpecifier;

    constructor(
        pattern: SyntaxTreePattern,
        slotSpecifier: TreePatternTemplateSlotSpecifier,
        partialSettings: Partial<TemplateSettings> = {}
    ) {
        super(partialSettings, deriveTemplateSettingsFromDefaults);
        this.treePatternFinder = new TreePatternFinder(pattern);
        this.slotSpecifier = slotSpecifier;
    }

    protected async provideFragmentsForDocument(document: Document): Promise<SyntacticFragment[]> {
        const fragments = await this.treePatternFinder.provideFragmentsForDocument(document);

        this.fragmentsToKeysToSlots.clear();
        for (let fragment of fragments) {
            const slotSpecifications = this.slotSpecifier(fragment, document);

            const keysToSlots: Map<TemplateSlotKey, TemplateSlot> = new Map();
            this.fragmentsToKeysToSlots.set(fragment, keysToSlots);

            for (let { key, node, valuatorProvider } of slotSpecifications) {
                keysToSlots.set(
                    key,
                    new SyntacticTemplateSlot(node, document, key, valuatorProvider)
                );
            }
        }

        return fragments;
    }

    protected getFragmentProvider(): FragmentProvider<SyntacticFragment> {
        return {
            provideFragmentsForDocument: this.provideFragmentsForDocument.bind(this)
        };
    }
}