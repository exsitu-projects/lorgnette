import { Document } from "../../documents/Document";
import { FragmentProvider } from "../../fragments/FragmentProvider"
import { FragmentType } from "../../fragments/FragmentType";
import { RegexPatternFinder } from "../../fragments/textual/RegexPatternFinder";
import { TextualFragment } from "../../fragments/textual/TextualFragment"
import { Template, deriveTemplateSettingsFromDefaults, TemplateSettings } from "../Template"
import { TemplateSlotKey } from "../TemplateSlot";
import { Evaluator } from "../evaluators/Evaluator";
import { TextualTemplateSlot } from "./TextualTemplateSlot";

export type RegexPatternTemplateSlotSpecification = Record<TemplateSlotKey, Evaluator>;

export class RegexPatternTemplate extends Template<TextualTemplateSlot, TextualFragment, TemplateSettings> {
    protected regexPatternFinder: RegexPatternFinder;
    protected slotSpecification: RegexPatternTemplateSlotSpecification;

    constructor(
        pattern: string,
        slotSpecification: RegexPatternTemplateSlotSpecification,
        partialSettings: Partial<TemplateSettings> = {}
    ) {
        super(partialSettings, deriveTemplateSettingsFromDefaults);
        this.regexPatternFinder = new RegexPatternFinder(pattern);
        this.slotSpecification = slotSpecification;
    }

    protected async provideFragmentsForDocument(document: Document): Promise<TextualFragment[]> {
        const fragmentsWithMatches = this.regexPatternFinder.provideFragmentsWithMatchesForDocument(document);

        // For each fragment, create its set of slots based on the groups matched by the regular expression
        // and map the fragment to its set of slots in order to be able to access it in the mappings.
        this.fragmentsToKeysToSlots.clear();

        for (let { fragment, match } of fragmentsWithMatches) {
            const keysToSlots: Map<TemplateSlotKey, TextualTemplateSlot> = new Map();
            this.fragmentsToKeysToSlots.set(fragment, keysToSlots);

            for (let [slotKey, slotValuator] of Object.entries(this.slotSpecification)) {
                // For each slot specification, try to find a regex group whose name matches the slot key.
                // Each match must generate a slot with the evaluator associated to that key.
                const matchingRegexGroup = match.groups.find(group => group.name === slotKey);
                if (matchingRegexGroup) {
                    keysToSlots.set(
                        slotKey,
                        new TextualTemplateSlot(
                            matchingRegexGroup.value,
                            matchingRegexGroup.range,
                            document,
                            slotKey,
                            slotValuator
                        )
                    );
                }
            }
        }

        return fragmentsWithMatches.map(({ fragment }) => fragment);
    }

    protected getFragmentProvider(): FragmentProvider<TextualFragment> {
        return {
            type: FragmentType.Textual,
            provideFragmentsForDocument: this.provideFragmentsForDocument.bind(this)
        };
    }
}