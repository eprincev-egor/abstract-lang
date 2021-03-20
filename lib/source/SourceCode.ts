import { Fragment } from "./Fragment";
import { Line } from "./Line";

export interface Coords {
    line: number;
    column: number;
}

export class SourceCode {

    readonly lines: readonly Line[];
    constructor(lines: readonly Line[]) {
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
