import { Position } from "../core/documents/Position";
import { Range } from "../core/documents/Range";

// Type of the raw position of a regex match or sub-match.
type RawPosition = [number, number];

// Type of a raw regex match.
// The current type provided by TypeScript (RegExpMatchArray) is not up-to-date.
interface RawRegexMatch {
    [index: number]: string;
    index: number;
    length: number;
    input: string;
    groups?: { [groupName: string]: string };
}

// Type of a raw regex match with raw positions.
// The current type provided by TypeScript (RegExpMatchArray) is not up-to-date.
interface RawRegexMatchWithPositions extends RawRegexMatch {
    indices: {
        [index: number]: RawPosition;
        groups?: { [groupName: string]: RawPosition };
    };
}

export interface RegexMatch {
    value: string;
    range: Range;
}

export interface RegexGroup {
    name: string | null;
    value: string;
    range: Range;
}

export interface RegexMatchWithGroups extends RegexMatch {
    groups: RegexGroup[];
}

function convertRawRegexMatch(
    regexMatchArray: RawRegexMatch,
    offsetToPositionConverter: (offset: number) => Position
): RegexMatch {
    return {
        value: regexMatchArray[0],
        range: new Range(
            offsetToPositionConverter(regexMatchArray.index!),
            offsetToPositionConverter(regexMatchArray.index! + regexMatchArray[0].length)
        )
    };
}

function convertRawRegexMatchWithGroups(
    rawMatch: RawRegexMatchWithPositions,
    offsetToPositionConverter: (offset: number) => Position
): RegexMatchWithGroups {
    // If the match array has no group, we can delegate the work to convertRawRegexMatch.
    if (!rawMatch.groups) {
        return {
            ...convertRawRegexMatch(rawMatch, offsetToPositionConverter),
            groups: []
        };
    }

    // Create both a map from raw group positions to groups
    // (to later update their names by matching the raw positions)
    // and an array of group (to keep the groups sorted).
    const rawRangesToRegexGroups = new Map<RawPosition, RegexGroup>();
    const regexGroups: RegexGroup[] = [];

    for (let i = 1; i < rawMatch.length; i++) {
        const rawPosition = rawMatch.indices[i];
        const group = {
            name: null, // will be modified later if the group is named
            value: rawMatch[i],
            range: new Range(
                offsetToPositionConverter(rawPosition[0]),
                offsetToPositionConverter(rawPosition[1])
            )
        };

        rawRangesToRegexGroups.set(rawPosition, group);
        regexGroups.push(group);
    }

    // Iterate over group names and update the name of regex groups whose raw position match.
    for (let [name, rawPosition] of Object.entries(rawMatch.indices.groups!)) {
        const match = rawRangesToRegexGroups.get(rawPosition)!;
        match.name = name;
    }

    return {
        value: rawMatch[0],
        range: new Range(
            offsetToPositionConverter(rawMatch.index!),
            offsetToPositionConverter(rawMatch.index! + rawMatch[0].length)
        ),
        groups: regexGroups
    };
}

export class RegexMatcher {
    pattern: string;
    flags: string[];

    constructor(pattern: string, flags: string = "") {
        this.pattern = pattern;
        this.flags = flags.split("");
    }

    // May throw an exception if the pattern is not valid.
    get regex(): RegExp {
        return new RegExp(this.pattern, this.flags.join(""));
    }

    getRegexWithFlags(flags: Iterable<string>): RegExp {
        return new RegExp(this.pattern, [...flags].join(""));
    }

    get nonGlobalRegex(): RegExp {
        // Ensure the "g" flag is NOT set.
        const flags = new Set(this.flags);
        flags.delete("g");

        return this.getRegexWithFlags(flags);
    }

    get globalRegex(): RegExp {
        // Ensure the "g" flag is set.
        const flags = new Set(this.flags);
        flags.add("g");

        return this.getRegexWithFlags(flags);
    }

    get globalRegexWithIndices(): RegExp {
        // Ensure the "g" and "d" flags are set.
        const flags = new Set(this.flags);
        flags.add("g");
        flags.add("d");

        return this.getRegexWithFlags(flags);
    }

    get isRegexPatternValid(): boolean {
        // Attempt to convert the pattern to a regex,
        // and catch the exception if it is invalid.
        try {
            // eslint-disable-next-line
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
        // of the start and end positions of the matching range, we manually compute the positions.
        const convertOffsetToPosition = Position.getOffsetToPositionConverterForText(input);

        const match = input.match(this.nonGlobalRegex);
        if (!match) {
            return null;
        }

        return convertRawRegexMatch(
            match as RawRegexMatch,
            convertOffsetToPosition
        );
    }

    matchAll(input: string): RegexMatch[] {
        // TODO: better deal with empty outputs.
        if (input.length === 0) {
            return [];
        }

        // Since the String.matchAll method only enable to compute the offsets
        // of the start and end positions of the matching ranges, we manually compute the positions.
        const convertOffsetToPosition = Position.getOffsetToPositionConverterForText(input);

        const matches = [...input.matchAll(this.globalRegex)];
        return matches.map(match => convertRawRegexMatch(
            match as RawRegexMatch,
            convertOffsetToPosition
        ));
    }

    matchAllWithGroups(input: string): RegexMatchWithGroups[] {
        // TODO: better deal with empty outputs.
        if (input.length === 0) {
            return [];
        }

        // Since the String.matchAll method only enable to compute the offsets
        // of the start and end positions of the matching ranges, we manually compute the positions.
        const convertOffsetToPosition = Position.getOffsetToPositionConverterForText(input);

        const matches = [...input.matchAll(this.globalRegexWithIndices)];
        return matches.map(match => convertRawRegexMatchWithGroups(
            match as unknown as RawRegexMatchWithPositions,
            convertOffsetToPosition
        ));
    }
}
