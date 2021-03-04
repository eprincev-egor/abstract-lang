import { Token } from "token";
import { Fragment } from "./Fragment";
import { Line } from "./Line";
import { SourceCode } from "./SourceCode";

const NEAR_LINES_QUANTITY = 4;

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

    static highlightToken(code: SourceCode, token: Token): string {
        const coords = code.getCoords(token.position);

        const startLine = Math.max(
            coords.line - 1 - NEAR_LINES_QUANTITY, 0
        );
        const endLine = coords.line + NEAR_LINES_QUANTITY;
        const fragment = code.getFragment(startLine, endLine);

        const highlighter = new Highlighter({
            fragment,
            underline: {
                ...coords,
                length: token.value.length
            }
        });
        return highlighter.highlight();
    }

    private fragment: Fragment;
    private underline: Underline;
    private constructor(params: HighlighterParams) {
        this.fragment = params.fragment;
        this.underline = params.underline;
    }

    private highlight() {
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


        return "\n" + code.join("\n");
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
