import { EndOfFleToken, EolToken, Token } from "../token";

export interface LineParams {
    number: number;
    firstCharPosition: number;
    tokens: Token[];
}

export class Line {

    static fromTokens(tokens: readonly Token[]): Line[] {
        const lines: Line[] = [];
        let lineTokens: Token[] = [];
        let firstCharPosition = 0;

        for (let i = 0, n = tokens.length; i < n; i++) {
            const token = tokens[i];

            if ( token instanceof EolToken || token instanceof EndOfFleToken ) {
                const line = new Line({
                    firstCharPosition,
                    number: lines.length + 1,
                    tokens: lineTokens
                });
                lines.push(line);
                lineTokens = [];
                firstCharPosition += line.length + token.value.length;
            }
            else {
                lineTokens.push(token);
            }
        }

        return lines;
    }

    readonly number: number;
    readonly firstCharPosition: number;
    readonly tokens: readonly Token[];
    readonly length: number;
    constructor(params: LineParams) {
        this.number = params.number;
        this.firstCharPosition = params.firstCharPosition;
        this.tokens = params.tokens;

        this.length = this.toString().length;
    }

    /** return true if the char position is between token start and end */
    containsPosition(charPosition: number): boolean {
        return (
            charPosition >= this.firstCharPosition &&
            charPosition < this.firstCharPosition + this.length
        );
    }

    getColumn(globalCharPosition: number): number {
        return globalCharPosition - this.firstCharPosition + 1;
    }

    toString(): string {
        return this.tokens
            .map((token) =>
                token.value
            )
            .join("");
    }
}