import { RegexMatcher, RegexMatchWithGroups } from "../../../utilities/RegexMatcher";
import { Document } from "../../documents/Document";
import { FragmentProvider } from "../../fragments/FragmentProvider";
import { FragmentType } from "../../fragments/FragmentType";
import { TextualFragment } from "../../fragments/textual/TextualFragment";
import { ProgrammableInputMapping } from "../../mappings/ProgrammableInputMapping";
import { ProgrammableOutputMapping } from "../../mappings/ProgrammableOutputMapping";
import { Template } from "../../templates/Template";
import { TemplateSlotSpecification } from "../../templates/TemplateProvider";
import { TemplateSlot, TemplateSlotKey } from "../../templates/TemplateSlot";
import { TemplateSlotValue } from "../../templates/TemplateSlotValuator";
import { TextualTemplateSlot } from "../../templates/textual/TextualTemplateSlot";
import { UserInterfaceInput, UserInterfaceOutput } from "../../user-interfaces/UserInterface";

export type RegexPatternFinderTemplateData = Record<TemplateSlotKey, TemplateSlotValue>;

export class RegexPatternFinder implements FragmentProvider<TextualFragment> {
    readonly type = FragmentType.Textual;
    private regexMatcher: RegexMatcher;

    constructor(pattern: string) {
        this.regexMatcher = new RegexMatcher(pattern);
    }

    get pattern(): string {
        return this.regexMatcher.pattern;
    }

    set pattern(newPattern: string) {
        this.regexMatcher.pattern = newPattern;
    }

    async provideFragmentsForDocument(document: Document): Promise<TextualFragment[]> {
        // If the document is empty, there is nothing to do.
        if (document.isEmpty) {
            return [];
        }

        return this.regexMatcher
            .matchAll(document.content)
            .map(match => TextualFragment.fromRegexMatch(match, document));
    }

    // TODO: give this method a better name/refactor?
    provideFragmentsWithMatchesForDocument(document: Document): { fragment: TextualFragment, match: RegexMatchWithGroups }[] {
        // If the document is empty, there is nothing to do.
        if (document.isEmpty) {
            return [];
        }

        return this.regexMatcher
            .matchAllWithGroups(document.content)
            .map(match => {
                return {
                    fragment: TextualFragment.fromRegexMatch(match, document),
                    match: match
                };
            });
    }

    // TODO: move transformers into a template settings object
    static createTemplate(
        pattern: string,
        slotSpecification: TemplateSlotSpecification,
        templateDataTransformer: (data: RegexPatternFinderTemplateData) => UserInterfaceInput = (data) => data,
        userInterfaceOutputTransformer: (output: UserInterfaceOutput) => RegexPatternFinderTemplateData = (output) => output,
    ): Template<TextualFragment> {
        const fragmentsToKeysToSlots: Map<TextualFragment, Map<TemplateSlotKey, TemplateSlot>> = new Map();

        return {
            fragmentProvider: (() => {
                const regexPatternFinder = new RegexPatternFinder(pattern);
                return {
                    async provideFragmentsForDocument(document: Document): Promise<TextualFragment[]> {
                        const fragmentsWithMatches = regexPatternFinder.provideFragmentsWithMatchesForDocument(document);

                        // For each fragment, create its set of slots based on the groups matched by the regular expression
                        // and map the fragment to its set of slots in order to be able to access it in the mappings.
                        fragmentsToKeysToSlots.clear();

                        for (let { fragment, match } of fragmentsWithMatches) {
                            const keysToSlots: Map<TemplateSlotKey, TemplateSlot> = new Map();
                            fragmentsToKeysToSlots.set(fragment, keysToSlots);

                            for (let [slotKey, slotValuatorProvider] of Object.entries(slotSpecification)) {
                                // For each slot specification, try to find a regex group whose name matches the slot key.
                                // Each match must generate a slot with the valuator associated to that key.
                                const matchingRegexGroup = match.groups.find(group => group.name === slotKey);
                                if (matchingRegexGroup) {
                                    keysToSlots.set(
                                        slotKey,
                                        new TextualTemplateSlot(
                                            matchingRegexGroup.value,
                                            matchingRegexGroup.range,
                                            document,
                                            slotKey,
                                            slotValuatorProvider
                                        )
                                    );
                                }
                            }
                        }

                        return fragmentsWithMatches.map(({ fragment }) => fragment);
                    }
                };
            })(),

            inputMapping: new ProgrammableInputMapping<TextualFragment>(({ fragment }) => {
                    const keysToSlots = fragmentsToKeysToSlots.get(fragment);
                    if (!keysToSlots) {
                        throw new Error("The slots could not be retrieved: there is no matching fragment.");
                    }

                    const slotKeysToValues: RegexPatternFinderTemplateData = {};
                    for (let [key, slot] of keysToSlots.entries()) {
                        slotKeysToValues[key] = slot.getValue();
                    }

                    return templateDataTransformer(slotKeysToValues);
                }),

            outputMapping: new ProgrammableOutputMapping<TextualFragment>(({ fragment, documentEditor, output }) => {
                    const keysToSlots = fragmentsToKeysToSlots.get(fragment);
                    if (!keysToSlots) {
                        throw new Error("The slots could not be retrieved: there is no matching fragment.");
                    }

                    const transformedOutput = userInterfaceOutputTransformer(output);

                    for (let [key, value] of Object.entries(transformedOutput)) {
                        const slot = keysToSlots.get(key);
                        if (!slot) {
                            console.warn(`There is no slot with key ${key}.`);
                            continue;
                        }

                        slot.setValue(value, documentEditor);
                    }

                    documentEditor.applyEdits();
                })
        };
    }
}