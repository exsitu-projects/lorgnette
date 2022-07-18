export type MonocleUid = number;

// Provide a generator of unique monocle IDs.
let nextUnusedMonocleUid = 1;

export function getUnusedUid(): MonocleUid {
    const unusedUid = nextUnusedMonocleUid;
    nextUnusedMonocleUid += 1;

    return unusedUid;
}