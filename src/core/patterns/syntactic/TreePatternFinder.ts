import { Document } from "../../documents/Document";
import { FragmentProvider } from "../../fragments/FragmentProvider";
import { FragmentType } from "../../fragments/FragmentType";
import { SyntacticFragment } from "../../fragments/syntactic/SyntacticFragment";
import { SyntaxTreeNode } from "../../languages/SyntaxTreeNode";
import { SyntaxTreePattern } from "../../languages/SyntaxTreePattern";
import { ProgrammableInputMapping } from "../../mappings/ProgrammableInputMapping";
import { ProgrammableOutputMapping } from "../../mappings/ProgrammableOutputMapping";
import { SyntacticTemplateSlot } from "../../templates/syntactic/SyntacticTemplateSlot";
import { Template } from "../../templates/Template";
import { TemplateSlotKey, TemplateSlot } from "../../templates/TemplateSlot";
import { TemplateSlotValuatorProvider, TemplateSlotValue } from "../../templates/TemplateSlotValuator";
import { UserInterfaceInput, UserInterfaceOutput } from "../../user-interfaces/UserInterface";

export type TreePatternTemplateData = Record<TemplateSlotKey, TemplateSlotValue>;

export interface TreePatternTemplateNodeWithSlotKey {
    node: SyntaxTreeNode;
    slotKey: TemplateSlotKey;
};

export interface TreePatternTemplateSlotSpecification {
    node: SyntaxTreeNode;
    key: TemplateSlotKey;
    valuatorProvider: TemplateSlotValuatorProvider;
}

export type TreePatternTemplateSlotSpecifier =
    (fragment: SyntacticFragment, document: Document) => TreePatternTemplateSlotSpecification[];

export class TreePatternTemplateFinder implements FragmentProvider<SyntacticFragment> {
    readonly type = FragmentType.Syntactic;
    private searchPattern: SyntaxTreePattern;

    constructor(searchPattern: SyntaxTreePattern) {
        this.searchPattern = searchPattern;
    }

    async provideFragmentsForDocument(document: Document): Promise<SyntacticFragment[]> {
        try {
            const syntaxTree = await document.syntaxTree;
            return this.searchPattern
                .apply(syntaxTree)
                .map(node => new SyntacticFragment(node, document));
        }
        catch (error: any) {
            // In case an error happens (e.g., during parsing), return an empty list.
            return [];
        }
    }
   
    static createTemplate(
        pattern: SyntaxTreePattern,
        slotSpecifier: TreePatternTemplateSlotSpecifier,
        templateDataTransformer: (data: TreePatternTemplateData) => UserInterfaceInput = (data) => data,
        userInterfaceOutputTransformer: (output: UserInterfaceOutput) => TreePatternTemplateData = (output) => output,
    ): Template<SyntacticFragment> {
        const fragmentsToKeysToSlots: Map<SyntacticFragment, Map<TemplateSlotKey, TemplateSlot>> = new Map();

        return {
            fragmentProvider: (() => {
                const regexPatternFinder = new TreePatternTemplateFinder(pattern);
                return {
                    async provideFragmentsForDocument(document: Document): Promise<SyntacticFragment[]> {
                        const fragments = await regexPatternFinder.provideFragmentsForDocument(document);

                        fragmentsToKeysToSlots.clear();
                        for (let fragment of fragments) {
                            const slotSpecifications = slotSpecifier(fragment, document);

                            const keysToSlots: Map<TemplateSlotKey, TemplateSlot> = new Map();
                            fragmentsToKeysToSlots.set(fragment, keysToSlots);

                            for (let { key, node, valuatorProvider } of slotSpecifications) {
                                keysToSlots.set(
                                    key,
                                    new SyntacticTemplateSlot(node, document, key, valuatorProvider)
                                );
                            }
                        }

                        return fragments;
                    }
                };
            })(),

            inputMapping: new ProgrammableInputMapping<SyntacticFragment>(({ fragment }) => {
                    const keysToSlots = fragmentsToKeysToSlots.get(fragment);
                    if (!keysToSlots) {
                        throw new Error("The slots could not be retrieved: there is no matching fragment.");
                    }

                    const slotKeysToValues: TreePatternTemplateData = {};
                    for (let [key, slot] of keysToSlots.entries()) {
                        slotKeysToValues[key] = slot.getValue();
                    }

                    return templateDataTransformer(slotKeysToValues);
                }),

            outputMapping: new ProgrammableOutputMapping<SyntacticFragment>(({ fragment, documentEditor, output }) => {
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

