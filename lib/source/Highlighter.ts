import { Fragment } from "./Fragment";
import { Line } from "./Line";

export interface Underline {
    line: number;
    column: number;
    length: number;
}
export interface HighlighterParams {
    fragment: Fragment;
    underline: Underline;
}

export class Highlighter {

    static highlight(params: HighlighterParams): string {
        return new Highlighter(params).print();
    }

    private fragment: Fragment;
    private underline: Underline;
    private constructor(params: HighlighterParams) {
        this.fragment = params.fragment;
        this.underline = params.underline;
    }

    private print() {
        const code: string[] = [];

        if ( this.fragment.existsLinesBefore ) {
            code.push("  ...|");
        }

        code.push(
            ...this.fragment.lines.map((line) =>
                this.printLine(line)
            )
        );

        if ( this.fragment.existsLinesAfter ) {
            code.push("  ...|");
        }


        return code.join("\n");
    }

    private printLine(line: Line): string {
        if ( line.number === this.underline.line ) {
            return [
                `> ${ this.printLineNumber(line) } |${ line.text }`,
                this.printUnderline()
            ].join("\n");
        }

        return `  ${ this.printLineNumber(line) } |${ line.text }`;
    }

    private printLineNumber(line: Line) {
        const spacesPrefix = " ".repeat(
            this.fragment.lineNumberWidth -
            line.numberWidth()
        );
        return spacesPrefix + line.number.toString();
    }

    private printUnderline() {
        const spaces = " ".repeat(
            this.underline.column +
            // every line printed with:
            // "  " or "> "
            // and
            //  " |"
            this.fragment.lineNumberWidth + 2 + 1
        );
        const underLine = "^".repeat(this.underline.length);
        return `${ spaces }${ underLine }`;
    }
}
