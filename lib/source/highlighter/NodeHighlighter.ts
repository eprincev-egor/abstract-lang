import { AbstractHighlighter, NEAR_LINES_QUANTITY } from "./AbstractHighlighter";
import { SourceCode } from "../SourceCode";
import { Fragment } from "../Fragment";
import { Line } from "../Line";

export interface BorderLine {
    start: number;
    end: number;
}

export interface HighlightNode {
    position: {
        start: number;
        end: number;
    };
}

export class NodeHighlighter extends AbstractHighlighter {

    /** highlight lines with a node */
    static highlight(code: SourceCode, node: HighlightNode): string {
        const start = code.getCoords(node.position.start);
        const end = code.getCoords(node.position.end);
        const fragment = code.getFragment(
            start.line - NEAR_LINES_QUANTITY - 1,
            end.line + NEAR_LINES_QUANTITY
        );

        const highlighter = new NodeHighlighter({
            fragment,
            borderLine: {
                start: start.line,
                end: end.line
            }
        });
        return highlighter.highlight();
    }

    protected borderLine: BorderLine;
    protected constructor(params: {
        fragment: Fragment;
        borderLine: BorderLine;
    }) {
        super(params.fragment);
        this.borderLine = params.borderLine;
    }

    protected isSelectedLine(line: Line): boolean {
        return (
            line.number >= this.borderLine.start &&
            line.number <= this.borderLine.end
        );
    }

    protected printSelectedLine(line: Line): string {
        return `> ${ this.printLineNumber(line) } |${ line.text }`;
    }
}