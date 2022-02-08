export interface RgbColor {
    r: number,
    g: number,
    b: number
};

export const BLACK: RgbColor = {r: 0, g: 0, b: 0};
export const WHITE: RgbColor = {r: 255, g: 255, b: 255};

function convertHexColorToRgbColor(hexColor: string): RgbColor | null {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // If the color could not be read from the string, return null.
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
        return null;
    }

    return {
        r: r,
        g: g,
        b: b
    };
}

export function convertCssColorToRgbColor(cssColor: string): RgbColor | null {
    const canvasContext = document.createElement("canvas").getContext("2d")!;
    canvasContext.fillStyle = cssColor;

    return convertHexColorToRgbColor(canvasContext.fillStyle);
}

export function convertRgbColorToCssColor(rgbColor: RgbColor): string {
    return `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`;
}