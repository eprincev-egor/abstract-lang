/* eslint-disable unicorn/error-message */
import { Token } from "../token";
import { Cursor } from "../cursor";
import { Coords, SourceCode } from "./SourceCode";
import { TokenHighlighter } from "./highlighter";

export interface SyntaxErrorParams {
    message: string;
    coords: Coords;
    token: Token;
}

export class SyntaxError extends Error {

    /** generate error with code fragment at near current token */
    static at(cursor: Cursor, message: string): SyntaxError {
        const token = cursor.nextToken;
        const code = SourceCode.fromTokens(cursor.tokens);
        const coords = code.getCoords(token.position);

        return new SyntaxError({
            message: [
                `SyntaxError: ${message}`,
                `line ${coords.line}, column ${coords.column}`,
                "",
                TokenHighlighter.highlight(code, token)
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