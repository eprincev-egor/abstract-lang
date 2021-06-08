import { AbstractHighlighter, NEAR_LINES_QUANTITY } from "./AbstractHighlighter";
import { Source } from "../interface";
import { Fragment } from "../Fragment";
import { Line } from "../Line";
import { TokenHighlighter } from "./TokenHighlighter";

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
    static highlight(code: Source, node: HighlightNode): string {
        const start = code.getCoords(node.position.start);
        const end = code.getCoords(node.position.end);

        if ( end.line === start.line ) {
            return TokenHighlighter.highlight(code, {
                position: node.position.start,
                length: node.position.end - node.position.start
            });
        }

        const fragment = code.getFragment(
            Math.max(start.line - NEAR_LINES_QUANTITY - 1, 0),
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