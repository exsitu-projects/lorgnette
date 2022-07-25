import { Document } from "../documents/Document";
import { FragmentType } from "../fragments/FragmentType";
import { Monocle } from "./Monocle";
import { MonocleProviderUsageRequirements } from "./MonocleUsageRequirements";

export interface MonocleProvider {
    readonly type: FragmentType;
    
    name: string;

    usageRequirements: MonocleProviderUsageRequirements;

    provideForDocument(document: Document, monocleToPreserve?: Monocle): Monocle[];
}