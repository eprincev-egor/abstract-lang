/* eslint-disable unicorn/error-message */
import { Token } from "../token";
import { Cursor } from "./Cursor";
import { Coords, SourceCode } from "./SourceCode";

export interface SyntaxErrorParams {
    message: string;
    coords: Coords;
    token: Token;
}

const HEIGHT = 4;

export class SyntaxError extends Error {

    static at(cursor: Cursor, message: string): SyntaxError {
        const token = cursor.nextToken;
        const code = new SourceCode(cursor.tokens);
        const coords = code.getCoords(token.position);
        const prevLines = code.lines.slice(coords.line - HEIGHT - 1, coords.line - 1);
        const currentLine = code.lines[ coords.line - 1];
        const nextLines = code.lines.slice(coords.line, coords.line + HEIGHT);

        return new SyntaxError({
            message: [
                `SyntaxError: ${message}`,
                `line ${coords.line}, column ${coords.column}`,
                "",
                "  ...|",
                ...prevLines.map((line) =>
                    `   ${ line.number } |${line.toString()}`
                ),
                `> ${ currentLine.number } |${currentLine.toString()}`,
                `     ${ repeat( " ", coords.column ) }${ repeat("^", token.value.length) }`,
                ...nextLines.map((line) =>
                    `  ${ line.number } |${line.toString()}`
                ),
                "  ...|"
            ].join("\n"),
            token,
            coords
        });
    }

    readonly message: string;
    /** invalid token */
    readonly token: Token;
    /** position with error */
    readonly coords: Coords;

    private constructor(params: SyntaxErrorParams) {
        super(params.message);

        this.message = params.message;
        this.token = params.token;
        this.coords = params.coords;
    }
}

function repeat(symbol: string, quantity: number) {
    let output = "";
    for (let i = 0; i < quantity; i ++) {
        output += symbol;
    }
    return output;
}
