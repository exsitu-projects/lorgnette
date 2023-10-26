export function ensureArrayHasLength<T>(array: T[], targetLength: number, padElement: T): T[] {
    const arrayLength = array.length;
    
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

// Note: the insertion index must be in the range [0, max. index + 1],
// i.e. it can be higher than the index of the last element of the array.
// This is required to support insertion at the end of the array.
export function moveElementsByIndex<T>(
    array: T[],
    movedElementIndices: number[],
    insertionIndex: number
): T[] {
    const newArray: T[] = [];
    const insertionIndexIsOutsideOfArray = insertionIndex === array.length;

    for (let i = 0; i <= array.length; i++) {
        // Case 1: the current index is the insertion index.
        if (i === insertionIndex) {
            const movedElements = array.filter((row, index) => movedElementIndices.includes(index));
            const movedElementIndicesIncludeCurrentIndex = movedElementIndices.includes(i);
            
            newArray.push(...movedElements);
            if (!movedElementIndicesIncludeCurrentIndex && !insertionIndexIsOutsideOfArray) {
                newArray.push(array[i]);
            }
        }
        // Case 2: the current index is the index of a row that is being moved.
        else if (movedElementIndices.includes(i)) {
            continue;
        }
        // Case 3: the current index is the index of a row that is NOT being moved.
        // We must ensure the current index is valid before inserting the row at that index.
        else if (i < array.length) {
            newArray.push(array[i]);
        }
    }

    return newArray;
}
