import { Document } from "../../../core/documents/Document";
import { DocumentEditor } from "../../../core/documents/DocumentEditor";
import { Range } from "../../../core/documents/Range";
import { ObjectNode } from "../../../core/languages/json/nodes/ObjectNode";
import { PropertyNode } from "../../../core/languages/json/nodes/PropertyNode";

// Search for the index of a property in a JSON object and returns it (or -1 if none were found).
// If several property names are specified, each name is compared against all the keys,
// one name after the other, until a match is found or all the names have been used.
export function findMatchingPropertyIndex(
    object: ObjectNode,
    propertyNameOrNames: string | string[]
): number {
    const propertyNames = Array.isArray(propertyNameOrNames) ? propertyNameOrNames : [propertyNameOrNames];

    for (let propertyName of propertyNames) {
        const matchingPropertyIndex = object.properties.findIndex(p => p.key.value === propertyName);
        if (matchingPropertyIndex >= 0) {
            return matchingPropertyIndex;
        }
    }

    return -1;
}

// Search for a property in a JSON object and returns it (or undefined if none were found).
// If several property names are specified, see findMatchingPropertyIndex for details on how they are used.
export function findMatchingProperty(
    object: ObjectNode,
    propertyNameOrNames: string | string[]
): PropertyNode | undefined {
    const propertyIndex = findMatchingPropertyIndex(object, propertyNameOrNames);
    return propertyIndex >= 0 ? object.properties[propertyIndex] : undefined;
}

// Utility to search for a property in a JSON object and perform
// one of two actions depending on whether it exists or not.
export function processProperty(
    object: ObjectNode,
    propertyNameOrNames: string | string[],
    actionIfPropertyIsPresent: (property: PropertyNode) => void,
    actionIfPropertyIsAbsent: () => void = () => {},
): void {
    const property = findMatchingProperty(object, propertyNameOrNames);

    if (property !== undefined) {
        actionIfPropertyIsPresent(property);
    }
    else {
        actionIfPropertyIsAbsent();
    }
}

// Utility to insert a new property at the end of a JSON object.
// The property is inserted even if another property with the same name already exists.
export function insertProperty(
    document: Document,
    editor: DocumentEditor,
    object: ObjectNode,
    propertyName: string,
    propertyValue: string
): void {
    const properties = object.properties;
    const newPropertyAsJsonString = `"${propertyName}": ${propertyValue}`;

    // If the object is empty, the braces are replaced by braces containing the new property.
    if (properties.length === 0) {
        editor.replace(object.range, `{ ${newPropertyAsJsonString} }`);
    }

    // If the object contains a single property, a comma, a space,
    // and the new property are inserted after that property.
    else if (properties.length === 1) {
        const existingProperty = properties[0];
        editor.insert(existingProperty.range.end, `, ${newPropertyAsJsonString}`);
    }

    // Otherwise, the content between the two last properties is inserted
    // at the end of the last property, followed by the new property.
    else {
        const lastProperty = properties[properties.length - 1];
        const secondTolastProperty = properties[properties.length - 2];
        const contentInBetween = document.getContentInRange(
            new Range(secondTolastProperty.range.end, lastProperty.range.start)
        );

        editor.insert(lastProperty.range.end, `${contentInBetween}${newPropertyAsJsonString}`);
    }
}

// Utility to delete a property from a JSON object.
// If no property with one of the given names is found, this function does nothing.
export function deleteProperty(
    editor: DocumentEditor,
    object: ObjectNode,
    propertyNameOrNames: string | string[]
): void {
    const properties = object.properties;
    const propertyToDeleteIndex = findMatchingPropertyIndex(object, propertyNameOrNames);

    // If no matching property was found, there is nothing to do.
    if (propertyToDeleteIndex === -1) {
        return;
    }

    const nbProperties = properties.length;
    const lastPropertyIndex = nbProperties - 1;
    const propertyToDelete = properties[propertyToDeleteIndex];

    // If the property is followed by at least one other property,
    // delete everything in between the beginning of the property to delete
    // to the beginning of the next property.
    if (propertyToDeleteIndex < lastPropertyIndex) {
        const nextProperty = properties[propertyToDeleteIndex + 1];
        editor.delete(
            new Range(propertyToDelete.range.start, nextProperty.range.start)
        );
    }

    // Otherwise, it means the property to delete is the last one.
    else {
        // If it is the only property, simply delete the property.
        if (nbProperties === 1) {
            editor.delete(propertyToDelete.range);
        }
        
        // Otherwise, delete everythingh from the end of the previous property
        // to the end of the property to delete.
        else {
            const previousProperty = properties[propertyToDeleteIndex - 1];
            editor.delete(
                new Range(previousProperty.range.end, propertyToDelete.range.end)
            );
        }
    }
}