import { EndOfFleToken, EndOfLineToken, Token } from "../token";
import { Fragment } from "./Fragment";
import { Line } from "./Line";

export interface Coords {
    line: number;
    column: number;
}

export class SourceCode {

    static fromTokens(tokens: readonly Token[]): SourceCode {
        const lines: Line[] = [];
        let lineTokens: Token[] = [];
        let firstCharPosition = 0;

        for (let i = 0, n = tokens.length; i < n; i++) {
            const token = tokens[i];

            if ( token instanceof EndOfLineToken || token instanceof EndOfFleToken ) {
                const line = new Line({
                    firstCharPosition,
                    number: lines.length + 1,
                    text: lineTokens
                        .map((token) => token.value)
                        .join("")
                });
                lines.push(line);

                firstCharPosition += (
                    line.text.length +
                    token.value.length
                );
                lineTokens = [];
            }
            else {
                lineTokens.push(token);
            }
        }

        return new SourceCode(lines);
    }

    readonly lines: readonly Line[];
    private constructor(lines: readonly Line[]) {
        this.lines = lines;
    }

    getCoords(charPosition: number): Coords {

        for (const line of this.lines) {
            if ( line.containsPosition(charPosition) ) {
                const coords: Coords = {
                    line: line.number,
                    column: line.getColumn(charPosition)
                };
                return coords;
            }
        }

        throw new Error(`not found line for char position: ${charPosition}`);
    }

    getFragment(fromLine: number, toLine: number): Fragment {
        const fragmentLines = this.lines.slice(fromLine, toLine);
        const fragment = new Fragment(
            fragmentLines,
            this.lines.length
        );
        return fragment;
    }
}
