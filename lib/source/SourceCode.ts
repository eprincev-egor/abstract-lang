import { Cursor } from "../cursor";
import {
    Token, Tokenizer, TokenMap,
    defaultMap, EndOfFleToken, EndOfLineToken
} from "../token";
import { Fragment } from "./Fragment";
import { Source, Coords } from "./interface";
import { Line } from "./Line";

export interface CodeParams {
    text: string;
    tokenMap?: TokenMap;
}

export class SourceCode
implements Source {
    readonly text: string;
    readonly tokens: Token[];
    readonly cursor: Cursor;
    protected _lines?: Line[];

    constructor(params: CodeParams) {
        this.text = params.text;

        const tokenMap = params.tokenMap || defaultMap;
        this.tokens = Tokenizer.tokenize(tokenMap, params.text);

        this.cursor = new Cursor(this);
    }

    get lines(): Line[] {
        if ( !this._lines ) {
            this._lines = this.generateLines();
        }
        return this._lines;
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

    getFragment(fromLine: number, toLine: number): Fragment {
        const fragmentLines = this.lines.slice(fromLine, toLine);
        const fragment = new Fragment(
            fragmentLines,
            this.lines.length
        );
        return fragment;
    }

    protected generateLines(): Line[] {
        const lines: Line[] = [];
        let lineTokens: Token[] = [];
        let firstCharPosition = 0;

        for (let i = 0, n = this.tokens.length; i < n; i++) {
            const token = this.tokens[i];

            if ( token instanceof EndOfFleToken || token instanceof EndOfLineToken ) {
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
