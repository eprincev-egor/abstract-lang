/* eslint-disable unicorn/error-message */
import { Token } from "../token";
import { Cursor } from "../cursor";
import { Coords, SourceCode } from "./SourceCode";
import { Highlighter } from "./Highlighter";

const NEAR_LINES_QUANTITY = 4;

export interface SyntaxErrorParams {
    message: string;
    coords: Coords;
    token: Token;
}

export class SyntaxError extends Error {

    static at(cursor: Cursor, message: string): SyntaxError {
        const token = cursor.nextToken;
        const code = SourceCode.fromTokens(cursor.tokens);
        const coords = code.getCoords(token.position);

        const startLine = Math.max(
            coords.line - 1 - NEAR_LINES_QUANTITY, 0
        );
        const endLine = coords.line + NEAR_LINES_QUANTITY;
        const fragment = code.getFragment(startLine, endLine);
        const highlightedFragment = Highlighter.highlight({
            fragment,
            underline: {
                ...coords,
                length: token.value.length
            }
        });

        return new SyntaxError({
            message: [
                `SyntaxError: ${message}`,
                `line ${coords.line}, column ${coords.column}`,
                "",
                highlightedFragment
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
