import { Fragment } from "./Fragment";
import { Line } from "./Line";
import { SourceCode } from "./SourceCode";

const NEAR_LINES_QUANTITY = 4;

export interface Underline {
    line: number;
    column: number;
    length: number;
}
export interface BorderLine {
    start: number;
    end: number;
}
export type HighlighterParams = {
    fragment: Fragment;
    underline: Underline;
} | {
    fragment: Fragment;
    borderLine: BorderLine;
}

export interface HighlightToken {
    position: number;
    value: string;
}
export interface HighlightNode {
    position: {
        start: number;
        end: number;
    };
}

export class Highlighter {

    static highlightToken(code: SourceCode, token: HighlightToken): string {
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

    static highlightNode(code: SourceCode, node: HighlightNode): string {
        const start = code.getCoords(node.position.start);
        const end = code.getCoords(node.position.end);
        const fragment = code.getFragment(
            start.line - NEAR_LINES_QUANTITY - 1,
            end.line + NEAR_LINES_QUANTITY
        );

        const highlighter = new Highlighter({
            fragment,
            borderLine: {
                start: start.line,
                end: end.line
            }
        });
        return highlighter.highlight();
    }

    private fragment: Fragment;
    private underline?: Underline;
    private borderLine?: BorderLine;
    private constructor(params: HighlighterParams) {
        this.fragment = params.fragment;
        if ( "underline" in params ) {
            this.underline = params.underline;
        }
        else {
            this.borderLine = params.borderLine;
        }
    }

    private highlight() {
        const code: string[] = [];

        if ( this.fragment.existsLinesBefore ) {
            code.push("  ...|");
        }

        code.push(
            ...this.fragment.lines.map((line) =>
                this.isSelectedLine(line) ?
                    this.printSelectedLine(line) :
                    this.printLine(line)
            )
        );

        if ( this.fragment.existsLinesAfter ) {
            code.push("  ...|");
        }


        return "\n" + code.join("\n");
    }

    private printSelectedLine(line: Line) {
        let output = `> ${ this.printLineNumber(line) } |${ line.text }`;
        if ( this.underline ) {
            output += "\n";
            output += this.printUnderline();
        }
        return output;
    }

    private printLine(line: Line) {
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
        if ( !this.underline ) {
            return "";
        }

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

    private isSelectedLine(line: Line) {
        if ( this.underline ) {
            return line.number === this.underline.line;
        }
        else if ( this.borderLine ) {
            return (
                line.number >= this.borderLine.start &&
                line.number <= this.borderLine.end
            );
        }

        return false;
    }
}
