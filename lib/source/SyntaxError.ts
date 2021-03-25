/* eslint-disable unicorn/error-message */
import { Token } from "../token";
import { Cursor } from "../cursor";
import { Coords } from "./interface";
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
        const {
            source,
            nextToken: token
        } = params.cursor;

        if ( params.node ) {
            const node = params.node;
            const position = node.position;
            if ( !position ) {
                throw new Error("node should have position");
            }

            const coords = source.getCoords(position.start);

            return new SyntaxError({
                message: [
                    `SyntaxError: ${params.message}`,
                    `line ${coords.line}, column ${coords.column}`,
                    "",
                    NodeHighlighter.highlight(source, {position})
                ].join("\n"),
                target: node,
                coords
            });
        }
        else {
            const coords = source.getCoords(token.position);

            return new SyntaxError({
                message: [
                    `SyntaxError: ${params.message}`,
                    `line ${coords.line}, column ${coords.column}`,
                    "",
                    TokenHighlighter.highlight(source, token)
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
