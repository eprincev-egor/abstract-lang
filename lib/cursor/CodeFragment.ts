import { Line } from "./Line";
import { Coords } from "./SourceCode";

export interface FragmentTarget {
    readonly start: Coords;
    readonly end: Coords;
}

const FRAGMENT_HEIGHT = 9;

export class CodeFragment {

    static from(
        lines: readonly Line[],
        startCoords: Coords,
        targetLength: number
    ): CodeFragment {
        const topLinesQuantity = (FRAGMENT_HEIGHT - 1) / 2;
        const bottomLinesQuantity = topLinesQuantity;
        const fragmentLines = lines.slice(
            startCoords.line - 1 - topLinesQuantity,
            startCoords.line + bottomLinesQuantity
        );

        const target: FragmentTarget = {
            start: startCoords,
            end: {
                line: startCoords.line,
                column: startCoords.column + targetLength
            }
        };
        return new CodeFragment(fragmentLines, target);
    }

    readonly lines: readonly Line[];
    readonly target: FragmentTarget;
    constructor(
        lines: readonly Line[],
        target: FragmentTarget
    ) {
        this.lines = lines;
        this.target = target;
    }

    toString(): string {
        const prevLines = this.lines.filter((line) =>
            line.number < this.target.start.line
        );
        const currentLine = this.lines.find((line) =>
            line.number === this.target.start.line
        ) as Line;
        const nextLines = this.lines.filter((line) =>
            line.number > this.target.end.line
        );

        const targetLength = (
            this.target.end.column -
            this.target.start.column
        );

        const code = [
            "  ...|",
            ...prevLines.map((line) =>
                `   ${ line.number } |${line.toString()}`
            ),

            `> ${ currentLine.number } |${currentLine.toString()}`,
            `     ${ repeat( " ", this.target.start.column ) }${ repeat("^", targetLength ) }`,

            ...nextLines.map((line) =>
                `  ${ line.number } |${line.toString()}`
            ),
            "  ...|"
        ];
        return code.join("\n");
    }
}

function repeat(symbol: string, quantity: number) {
    let output = "";
    for (let i = 0; i < quantity; i ++) {
        output += symbol;
    }
    return output;
}
