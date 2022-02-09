export type CodeVisualisationId = number;

// Provide a generator of unused code visualisation IDs.
let nextUnusedCodeVisualisationId = 1;

export function getUnusedId(): CodeVisualisationId {
    const unusedId = nextUnusedCodeVisualisationId;
    nextUnusedCodeVisualisationId += 1;

    return unusedId;
}