import { Line } from "./Line";
import { Coords } from "./SourceCode";

export interface FragmentTarget {
    readonly start: Coords;
    readonly end: Coords;
}

const NEAR_LINES_QUANTITY = 4;

export class CodeFragment {

    static from(
        allLines: readonly Line[],
        startCoords: Coords,
        targetLength: number
    ): CodeFragment {
        const target: FragmentTarget = {
            start: startCoords,
            end: {
                line: startCoords.line,
                column: startCoords.column + targetLength
            }
        };

        return new CodeFragment(
            allLines,
            target
        );
    }

    private readonly target: FragmentTarget;
    private readonly prevLines: readonly Line[];
    private readonly currentLine: Line;
    private readonly nextLines: readonly Line[];
    private readonly maxNumberSize: number;
    private readonly existsLinesBefore: boolean;
    private readonly existsLinesAfter: boolean;

    private constructor(
        allLines: readonly Line[],
        target: FragmentTarget
    ) {
        const fragmentLines = allLines.slice(
            Math.max(target.start.line - 1 - NEAR_LINES_QUANTITY, 0),
            target.start.line + NEAR_LINES_QUANTITY
        );
        this.target = target;

        this.prevLines = fragmentLines.filter((line) =>
            line.number < target.start.line
        );
        this.currentLine = fragmentLines.find((line) =>
            line.number === target.start.line
        ) as Line;
        this.nextLines = fragmentLines.filter((line) =>
            line.number > target.end.line
        );

        this.maxNumberSize = last(fragmentLines).number
            .toString().length;

        this.existsLinesBefore = fragmentLines[0].number > 1;
        this.existsLinesAfter = (
            last(fragmentLines).number < last(allLines).number
        );
    }

    toString(): string {
        const code: string[] = [];

        if ( this.existsLinesBefore ) {
            code.push("  ...|");
        }

        code.push(
            ...this.prevLines.map((line) =>
                this.printLine(line)
            ),

            this.printCurrentLine(),
            this.printTargetUnderline(),

            ...this.nextLines.map((line) =>
                this.printLine(line)
            )
        );

        if ( this.existsLinesAfter ) {
            code.push("  ...|");
        }


        return code.join("\n");
    }

    private printLine(line: Line): string {
        return `  ${ this.printLineNumber(line) } |${line.toString()}`;
    }

    private printCurrentLine() {
        const line = this.currentLine;
        return `> ${ this.printLineNumber(line) } |${line.toString()}`;
    }

    private printTargetUnderline() {
        const spaces = repeat( " ",
            this.target.start.column +
            // every line printed with:
            // "  " or "> "
            // and
            //  " |"
            this.maxNumberSize + 2 + 1
        );
        const underLine = repeat( "^",
            this.target.end.column -
            this.target.start.column
        );

        return `${ spaces }${ underLine }`;
    }

    private printLineNumber(line: Line) {
        const needSpaces = (
            this.maxNumberSize -
            line.number.toString().length
        );
        return `${repeat(" ", needSpaces)}${ line.number }`;
    }
}

function repeat(symbol: string, quantity: number) {
    let output = "";
    for (let i = 0; i < quantity; i ++) {
        output += symbol;
    }
    return output;
}

function last<T>(array: readonly T[]): T {
    return array.slice(-1)[0];
}