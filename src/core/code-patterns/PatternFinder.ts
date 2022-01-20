import { Document } from "../documents/Document";
import { CodeVisualisationType } from "../visualisations/CodeVisualisationType";
import { Pattern } from "./Pattern";

export interface PatternFinder<
    T extends CodeVisualisationType,
    P = Pattern<T>
> {
    type: string;
    applyInDocument(document: Document): P[];
}