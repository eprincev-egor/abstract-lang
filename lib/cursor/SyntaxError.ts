/* eslint-disable unicorn/error-message */
import { EolToken, Token } from "../token";
import { Cursor } from "./Cursor";

interface SyntaxErrorPosition {
    line: number;
    column: number;
}

export interface SyntaxErrorParams {
    message: string;
    line: number;
    column: number;
    token: Token;
}

export class SyntaxError extends Error {

    static at(cursor: Cursor, message: string): SyntaxError {
        const token = cursor.nextToken;
        const {line, column} = calculatePosition(cursor, token);

        return new SyntaxError({
            message,
            token,
            line,
            column
        });
    }

    readonly message: string;
    /** invalid token */
    readonly token: Token;
    /** line number with error */
    readonly line: number;
    /** token position inside line */
    readonly column: number;

    private constructor(params: SyntaxErrorParams) {
        super(params.message);

        this.message = params.message;
        this.token = params.token;
        this.line = params.line;
        this.column = params.column;
    }
}

function calculatePosition(cursor: Cursor, token: Token): SyntaxErrorPosition {
    let line = 1;
    let column = 1;

    for (let i = 0, n = cursor.tokens.length; i < n; i++) {
        const someToken = cursor.tokens[i];

        if ( token === someToken ) {
            for (let j = i - 1; j >= 0; j--) {
                const prevTokenOnLine = cursor.tokens[j];
                if ( prevTokenOnLine instanceof EolToken ) {
                    break;
                }

                column += prevTokenOnLine.value.length;
            }
            break;
        }

        if ( someToken instanceof EolToken ) {
            line++;
        }
    }

    return {line, column};
}

function calculateNearCode(
    cursor: Cursor,
    token: Token,
    position: SyntaxErrorPosition
) {}