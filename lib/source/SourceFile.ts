import {
    Token, Tokenizer,
    defaultMap, TokenMap,
    EndOfLineToken, EndOfFleToken
} from "../token";
import { Cursor } from "../cursor";
import { Line } from "./Line";

export interface FileParams {
    path: string;
    content: string;
    tokenMap?: TokenMap;
}

export class SourceFile {
    readonly path: string;
    readonly content: string;
    readonly tokens: Token[];
    readonly cursor: Cursor;

    constructor(params: FileParams) {
        this.path = params.path;
        this.content = params.content;

        const tokenMap = params.tokenMap || defaultMap;
        this.tokens = Tokenizer.tokenize(tokenMap, params.content);

        this.cursor = new Cursor(this);
    }

    generateLines(): Line[] {
        const lines: Line[] = [];
        let lineTokens: Token[] = [];
        let firstCharPosition = 0;

        for (let i = 0, n = this.tokens.length; i < n; i++) {
            const token = this.tokens[i];

            if ( token instanceof EndOfLineToken || token instanceof EndOfFleToken ) {
                const line = new Line({
                    firstCharPosition,
                    number: lines.length + 1,
                    text: lineTokens
                        .map((token) => token.value)
                        .join("")
                });
                lines.push(line);

                firstCharPosition += (
                    line.text.length +
                    token.value.length
                );
                lineTokens = [];
            }
            else {
                lineTokens.push(token);
            }
        }

        return lines;
    }
}