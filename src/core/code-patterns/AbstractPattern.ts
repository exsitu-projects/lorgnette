import { Range } from "../documents/Range";

export abstract class AbstractPatern {
    abstract get range(): Range;
    abstract get text(): string;
}