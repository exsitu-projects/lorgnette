import { Document } from "../documents/Document";
import { DocumentRange } from "../documents/DocumentRange";

export abstract class AbstractPatern {
    abstract get range(): DocumentRange;
    abstract get text(): string;
    abstract get document(): Document;
}