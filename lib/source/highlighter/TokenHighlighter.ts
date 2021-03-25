import { AbstractHighlighter, NEAR_LINES_QUANTITY } from "./AbstractHighlighter";
import { Fragment } from "../Fragment";
import { Line } from "../Line";
import { Source } from "../interface";

export interface HighlightToken {
    position: number;
    length: number;
}
export interface Underline {
    line: number;
    column: number;
    length: number;
}

export class TokenHighlighter extends AbstractHighlighter {

    /** highlight single line with a token and underline under the token */
    static highlight(code: Source, token: HighlightToken): string {
        const coords = code.getCoords(token.position);

        const startLine = Math.max(
            coords.line - 1 - NEAR_LINES_QUANTITY, 0
        );
        const endLine = coords.line + NEAR_LINES_QUANTITY;
        const fragment = code.getFragment(startLine, endLine);

        const highlighter = new TokenHighlighter({
            fragment,
            underline: {
                ...coords,
                length: token.length
            }
        });
        return highlighter.highlight();
    }

    private underline: Underline;
    protected constructor(params: {
        fragment: Fragment;
        underline: Underline;
    }) {
        super(params.fragment);
        this.underline = params.underline;
    }

    protected isSelectedLine(line: Line): boolean {
        return line.number === this.underline.line;
    }

    protected printSelectedLine(line: Line): string {
        return [
            `> ${ this.printLineNumber(line) } |${ line.text }`,
            this.printUnderline()
        ].join("\n");
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