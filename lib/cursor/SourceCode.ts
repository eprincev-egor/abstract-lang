import { Token } from "../token";
import { Line } from "./Line";

export interface Coords {
    line: number;
    column: number;
}

export class SourceCode {

    readonly lines: readonly Line[];
    constructor(tokens: readonly Token[]) {
        this.lines = Line.fromTokens(tokens);
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

    toString(): string {
        return this.lines.map((line) =>
            line.toString()
        ).join("\n");
    }
}
