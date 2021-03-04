import { Line } from "./Line";

export class Fragment {

    readonly lines: readonly Line[];
    readonly lineNumberWidth: number;
    readonly existsLinesBefore: boolean;
    readonly existsLinesAfter: boolean;

    constructor(
        lines: readonly Line[],
        allLinesQuantity: number
    ) {
        this.lines = lines;

        this.lineNumberWidth = last(lines).number
            .toString().length;

        this.existsLinesBefore = lines[0].number > 1;
        this.existsLinesAfter = (
            last(lines).number < allLinesQuantity
        );
    }
}

export function last<T>(array: readonly T[]): T {
    return array.slice(-1)[0];
}