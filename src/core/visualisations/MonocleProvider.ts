import { Document } from "../documents/Document";
import { CodeFragmentType } from "./CodeFragmentType";
import { Monocle } from "./Monocle";
import { MonocleProviderUsageRequirements } from "./MonocleUsageRequirements";

export interface MonocleProvider {
    readonly type: CodeFragmentType;
    
    name: string;

    usageRequirements: MonocleProviderUsageRequirements;

    provideForDocument(document: Document): Monocle[];
}