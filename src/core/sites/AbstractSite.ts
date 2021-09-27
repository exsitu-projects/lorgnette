import { Range } from "../documents/Range";

export abstract class AbstractSite {
    abstract get range(): Range;
    abstract get text(): string;
}