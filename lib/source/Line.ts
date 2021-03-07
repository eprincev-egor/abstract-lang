export interface LineParams {
    number: number;
    firstCharPosition: number;
    text: string;
}

export class Line {

    readonly number: number;
    readonly firstCharPosition: number;
    readonly text: string;
    constructor(params: LineParams) {
        this.number = params.number;
        this.firstCharPosition = params.firstCharPosition;
        this.text = params.text;
    }

    /** return true if the char position is between token start and end */
    containsPosition(charPosition: number): boolean {
        return (
            charPosition >= this.firstCharPosition &&
            charPosition <= this.firstCharPosition + this.text.length
        );
    }

    /** returns column number inside this line */
    getColumn(globalCharPosition: number): number {
        return globalCharPosition - this.firstCharPosition + 1;
    }

    /** returns line.number.length */
    numberWidth(): number {
        return this.number.toString().length;
    }
}