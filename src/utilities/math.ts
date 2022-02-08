export function clamp(
    min: number,
    value: number,
    max: number,
): number {
    return Math.max(Math.min(value, max), min);
}

// Adapted from https://stackoverflow.com/a/41716722
export function round(
    value: number,
    nbDecimals: number
): number {
    const tenPowerNbDecimals = 10**nbDecimals;
    return Math.round((value + Number.EPSILON) * tenPowerNbDecimals) / tenPowerNbDecimals;
}