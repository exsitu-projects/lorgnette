export function getRegexBody(regex: RegExp): string {
    const regexAsString = regex.toString();
    return regexAsString.slice(1, regexAsString.length - 1);
}

export function getRegexFlags(regex: RegExp): string {
    return regex.flags;
}

export class SplitRegex {
    readonly body: string;
    readonly flags: string;

    constructor(body: string, flags: string) {
        this.body = body;
        this.flags = flags;
    }

    isEqualTo(otherSplitRegex: SplitRegex): boolean {
        return this.body === otherSplitRegex.body
            && this.flags === otherSplitRegex.flags;
    }

    static fromRegex(regex: RegExp): SplitRegex {
        return new SplitRegex(
            getRegexBody(regex),
            getRegexFlags(regex)
        );
    }
}