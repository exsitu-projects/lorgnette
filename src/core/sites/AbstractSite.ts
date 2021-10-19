import { Pattern } from "../code-patterns/Pattern";
import { Document } from "../documents/Document";
import { DocumentRange } from "../documents/DocumentRange";

export abstract class AbstractSite {
    abstract get pattern(): Pattern;
    abstract get range(): DocumentRange;
    abstract get text(): string;

    get document(): Document {
        return this.range.document;
    }
}