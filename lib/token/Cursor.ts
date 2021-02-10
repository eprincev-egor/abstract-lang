import { Token } from "./Token";

/**
 * Text cursor between some tokens.
 */
export class Cursor {

    private readonly tokens: readonly Token[];
    private tokenIndex: number;
    private nextToken: Token;
    constructor(tokens: Token[]) {
        // TODO:
        // token.length > 0
        this.tokens = tokens;
        this.tokenIndex = 0;
        this.nextToken = this.tokens[ this.tokenIndex ];
    }

    /**
     * equal next token value
     */
    before(tokenValue: string): boolean {
        return this.nextToken.value === tokenValue;
    }

    /**
     * move cursor if next token value is correct,
     * else throw error
     */
    read(expectedToken: string): void {
        if ( this.nextToken.value !== expectedToken ) {
            throw new Error([
                `unexpected token: "${this.nextToken.value}",`,
                `expected: "${expectedToken}"`
            ].join(" "));
        }

        this.tokenIndex++;
        this.nextToken = this.tokens[ this.tokenIndex ];
    }

    /**
     * move cursor position before token
     */
    moveBefore(token: Token): void {
        this.tokenIndex = this.tokens.indexOf(token);
        this.nextToken = this.tokens[ this.tokenIndex ];
    }
}