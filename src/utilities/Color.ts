export interface RgbColor {
    r: number;
    g: number;
    b: number;
}

export interface RgbaColor extends RgbColor {
    a: number;
}

export class Color {
    r: number;
    g: number;
    b: number;
    a: number;

    constructor(
        r: number, 
        g: number, 
        b: number, 
        a?: number
    ) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a ?? 1;
    }

    get css(): string {
        return this.a === undefined || this.a === 1
        ? `rgb(${this.r}, ${this.g}, ${this.b})`
        : `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

    get hexString(): string {
        const r = this.r.toString(16);
        const g = this.g.toString(16);
        const b = this.b.toString(16);
        const a = this.a === 1 ? "" : this.a.toString(16);

        return `#${r}${g}${b}${a}`;
    }

    equals(otherColor: Color): boolean {
        return this.r === otherColor.r 
            && this.g === otherColor.g 
            && this.b === otherColor.b 
            && this.a === otherColor.a;
    }
    
    static fromRgb(rgbColor: RgbColor): Color {
        return new Color(rgbColor.r, rgbColor.g, rgbColor.b, 1);
    }
    
    static fromRgba(rgbaColor: RgbaColor): Color {
        return new Color(rgbaColor.r, rgbaColor.g, rgbaColor.b, rgbaColor.a);
    }
    
    static fromRgbaString(rgbaColorString: string): Color {
        const regex = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+|(?:\d*.\d+))\s*\)/;
        const regexExecResults = regex.exec(rgbaColorString);

        if (!regexExecResults || regexExecResults.length !== 5) {
            throw new Error(`String "${rgbaColorString}" could not be parsed as a RGBA color.`);
        }

        return new Color(
            Number(regexExecResults[1]),
            Number(regexExecResults[2]),
            Number(regexExecResults[3]),
            Number(regexExecResults[4]),
        );
    }

    static fromHexString(hexColorString: string): Color {
        const r = parseInt(hexColorString.slice(1, 3), 16);
        const g = parseInt(hexColorString.slice(3, 5), 16);
        const b = parseInt(hexColorString.slice(5, 7), 16);
    
        const a = hexColorString.length === 9
            ? parseInt(hexColorString.slice(7, 9), 16)
            : 1;
    
        // If the color could not be read from the string, return null.
        if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) {
            throw new Error(`String "${hexColorString}" could not be parsed as an hexadecimal color.`);
        }
    
        return new Color(r, g, b, a);
    }

    static fromCss(cssColor: string): Color {
        const canvasContext = document.createElement("canvas").getContext("2d")!;

        canvasContext.fillStyle = cssColor;
        const canvasFillStyle = canvasContext.fillStyle;
    
        // It seems that fillStyle contains an hexadecimal color if there is no transparency (#rrggbb), 
        // and a RGBA color otherwise (rgba(r, g, b, a)).
        return canvasFillStyle.charAt(0) === "#"
            ? Color.fromHexString(canvasFillStyle)
            : Color.fromRgbaString(canvasFillStyle);
    }
};

export const BLACK = new Color(0, 0, 0, 1);
export const WHITE = new Color(255, 255, 255, 1);

export const RED = new Color(255, 0, 0, 1);
export const GREEN = new Color(0, 255, 0, 1);
export const BLUE = new Color(0, 0, 255, 1);

export const TRANSPARENT = new Color(0, 0, 0, 0);
