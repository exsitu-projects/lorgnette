export function ensureArrayHasLength<T>(array: T[], targetLength: number, padElement: T): T[] {
    const arrayLength = array.length
    
    if (arrayLength === targetLength) {
        return array;
    }
    else if (arrayLength < targetLength) {
        const nbMissingElements = targetLength - arrayLength;
        return array.concat(new Array(nbMissingElements).fill(padElement));
    }
    else {
        return array.slice(0, targetLength);
    }
}
