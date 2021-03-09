/* eslint-disable unicorn/error-message */
import { Token } from "../token";
import { Cursor } from "../cursor";
import { Coords, SourceCode } from "./SourceCode";
import { NodeHighlighter, TokenHighlighter } from "./highlighter";
import { AbstractNode } from "../node";

export interface SyntaxErrorParams {
    message: string;
    coords: Coords;
    target: Token | AbstractNode<any>;
}

export class SyntaxError extends Error {

    /** generate error with code fragment at near current token */
    static at(params: {
        cursor: Cursor;
        node?: AbstractNode<any>;
        message: string;
    }): SyntaxError {
        const code = SourceCode.fromTokens(params.cursor.tokens);

        if ( params.node ) {
            const node = params.node;
            const position = node.position;
            if ( !position ) {
                throw new Error("node should have position");
            }

            const coords = code.getCoords(position.start);

            return new SyntaxError({
                message: [
                    `SyntaxError: ${params.message}`,
                    `line ${coords.line}, column ${coords.column}`,
                    "",
                    NodeHighlighter.highlight(code, {position})
                ].join("\n"),
                target: node,
                coords
            });
        }
        else {
            const token = params.cursor.nextToken;
            const coords = code.getCoords(token.position);

            return new SyntaxError({
                message: [
                    `SyntaxError: ${params.message}`,
                    `line ${coords.line}, column ${coords.column}`,
                    "",
                    TokenHighlighter.highlight(code, token)
                ].join("\n"),
                target: token,
                coords
            });
        }
    }

    readonly message: string;
    /** invalid token or node */
    readonly target: Token | AbstractNode<any>;
    /** position with error */
    readonly coords: Coords;

    private constructor(params: SyntaxErrorParams) {
        super(params.message);

        this.message = params.message;
        this.target = params.target;
        this.coords = params.coords;
    }
}
