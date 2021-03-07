import { Fragment } from "../Fragment";
import { Line } from "../Line";

export const NEAR_LINES_QUANTITY = 4;

export abstract class AbstractHighlighter {

    protected fragment: Fragment;
    protected constructor(fragment: Fragment) {
        this.fragment = fragment;
    }

    protected abstract isSelectedLine(line: Line): boolean;
    protected abstract printSelectedLine(line: Line): string;

    protected highlight(): string {
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

    protected printLine(line: Line): string {
        return `  ${ this.printLineNumber(line) } |${ line.text }`;
    }

    protected printLineNumber(line: Line): string {
        const spacesPrefix = " ".repeat(
            this.fragment.lineNumberWidth -
            line.numberWidth()
        );
        return spacesPrefix + line.number.toString();
    }
}