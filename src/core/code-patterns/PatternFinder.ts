import { Document } from "../documents/Document";
import { CodeFragmentType } from "../visualisations/CodeFragmentType";
import { Pattern } from "./Pattern";

export interface PatternFinder<
    T extends CodeFragmentType,
    P = Pattern<T>
> {
    type: string;
    applyInDocument(document: Document): P[];
}