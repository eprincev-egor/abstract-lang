/* eslint-disable unicorn/error-message */
import { Token } from "../token";
import { Source, Coords } from "./interface";
import { NodeHighlighter, TokenHighlighter } from "./highlighter";
import { AbstractNode } from "../node";

export interface SyntaxErrorParams {
    message: string;
    coords: Coords;
    target: Token | AbstractNode<any>;
}

export type SyntaxErrorTarget = Token | AbstractNode<any>;

export class SyntaxError extends Error {

    /** generate error with code fragment at near current token */
    static at(params: {
        source: Source;
        node?: AbstractNode<any>;
        message: string;
    }): SyntaxError {
        const {source, node, message} = params;
        const {target, coords, highlight} = prepareTarget(source, node);

        return new SyntaxError({
            message: [
                `SyntaxError: ${message}`,
                preparePath(source, coords),
                "",
                highlight
            ].join("\n"),
            target,
            coords
        });
    }

    readonly message: string;
    /** invalid token or node */
    readonly target: SyntaxErrorTarget;
    /** position with error */
    readonly coords: Coords;

    private constructor(params: SyntaxErrorParams) {
        super(params.message);

        this.message = params.message;
        this.target = params.target;
        this.coords = params.coords;
    }
}

function prepareTarget(
    source: Source,
    node?: AbstractNode<any>
) {
    if ( node ) {
        const position = node.position;
        if ( !position ) {
            throw new Error("node should have position");
        }

        return {
            target: node,
            coords: source.getCoords(position.start),
            highlight: NodeHighlighter.highlight(source, {position})
        };
    }
    else {
        const token = source.cursor.nextToken;
        return {
            target: token,
            coords: source.getCoords(token.position),
            highlight: TokenHighlighter.highlight(source, token)
        };
    }
}

function preparePath(source: Source, coords: Coords) {
    return source.path ?
        `${source.path}:${coords.line}:${coords.column}` :
        `line ${coords.line}, column ${coords.column}`;
}