/* eslint-disable unicorn/error-message */
import { Token } from "../token";
import { Cursor } from "./Cursor";
import { Coords, SourceCode } from "./SourceCode";

export interface SyntaxErrorParams {
    message: string;
    coords: Coords;
    token: Token;
}

export class SyntaxError extends Error {

    static at(cursor: Cursor, message: string): SyntaxError {
        const token = cursor.nextToken;
        const code = new SourceCode(cursor.tokens);
        const coords = code.getCoords(token.position);
        const fragment = code.getFragment(token);

        return new SyntaxError({
            message: [
                `SyntaxError: ${message}`,
                `line ${coords.line}, column ${coords.column}`,
                "",
                fragment.toString()
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
