import { Position } from "../core/documents/Position";
import { Range } from "../core/documents/Range";

export interface RegexMatch {
    value: string;
    range: Range;
}

export class RegexMatcher {
    pattern: string;
    flags: string;

    constructor(pattern: string, flags: string = "") {
        this.pattern = pattern;
        this.flags = flags;
    }

    // May throw an exception if the pattern is not valid.
    get regex(): RegExp {
        return new RegExp(this.pattern, this.flags);
    }

    get nonGlobalRegex(): RegExp {
        const nonGlobalFlags = this.flags
            .split("")
            .filter(flag => flag !== "g")
            .join("");

        return new RegExp(this.pattern, nonGlobalFlags);
    }

    get globalRegex(): RegExp {
        const hasGlobalFlag = this.flags.includes("g");
        const flagsWithGlobalFlag = hasGlobalFlag
            ? this.flags
            : this.flags.concat("g");

        return new RegExp(this.pattern, flagsWithGlobalFlag);
    }

    get isRegexPatternValid(): boolean {
        // Attempt to convert the pattern to a regex,
        // and catch the exception if it is invalid.
        try {
            const _ = this.regex;
        }
        catch (error) {
            return false;
        }

        return true;
    }

    match(input: string): RegexMatch | null {
        // TODO: better deal with empty outputs.
        if (input.length === 0) {
            return null;
        }

        // Since the String.match method only enable to compute the offset
        // of the start and end positions of the matching range, we have to compute them ourselves.
        const convertOffsetToPosition = Position.getOffsetToPositionConverterForText(input);

        const match = input.match(this.nonGlobalRegex);
        if (!match) {
            return null;
        }

        return {
            value: match[0],
            range: new Range(
                convertOffsetToPosition(match.index!),
                convertOffsetToPosition(match.index! + match[0].length)
            )
        };
    }

    matchAll(input: string): RegexMatch[] {
        // TODO: better deal with empty outputs.
        if (input.length === 0) {
            return [];
        }

        // Since the String.match method only enable to compute the offsets
        // of the start and end positions of the matching ranges, we have to compute them ourselves.
        const convertOffsetToPosition = Position.getOffsetToPositionConverterForText(input);

        const matches = [...input.matchAll(this.globalRegex)];
        return matches.map(match => {
            return {
                value: match[0],
                range: new Range(
                    convertOffsetToPosition(match.index!),
                    convertOffsetToPosition(match.index! + match[0].length)
                )
            };
        });
    }
}