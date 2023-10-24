export type ProjectionUid = number;

// Provide a generator of unique projection IDs.
let nextUnusedProjectionUid = 1;

export function getUnusedUid(): ProjectionUid {
    const unusedUid = nextUnusedProjectionUid;
    nextUnusedProjectionUid += 1;

    return unusedUid;
}