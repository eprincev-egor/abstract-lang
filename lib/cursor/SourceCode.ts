import { Token } from "../token";
import { Line } from "./Line";

export interface Coords {
    line: number;
    column: number;
}

const FRAGMENT_HEIGHT = 9;

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

    getFragmentAtNear(target: Token): string {
        const coords = this.getCoords(target.position);
        const topLinesQuantity = (FRAGMENT_HEIGHT - 1) / 2;
        const bottomLinesQuantity = topLinesQuantity;
        const prevLines = this.lines.slice(
            coords.line - 1 - topLinesQuantity,
            coords.line - 1
        );
        const currentLine = this.lines[ coords.line - 1];
        const nextLines = this.lines.slice(
            coords.line,
            coords.line + bottomLinesQuantity
        );

        const fragmentWithTarget = [
            "  ...|",
            ...prevLines.map((line) =>
                `   ${ line.number } |${line.toString()}`
            ),

            `> ${ currentLine.number } |${currentLine.toString()}`,
            `     ${ repeat( " ", coords.column ) }${ repeat("^", target.value.length) }`,

            ...nextLines.map((line) =>
                `  ${ line.number } |${line.toString()}`
            ),
            "  ...|"
        ];
        return fragmentWithTarget.join("\n");
    }

    toString(): string {
        return this.lines.map((line) =>
            line.toString()
        ).join("\n");
    }
}

function repeat(symbol: string, quantity: number) {
    let output = "";
    for (let i = 0; i < quantity; i ++) {
        output += symbol;
    }
    return output;
}
