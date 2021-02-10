import { Token, TokenClass } from "./Token";

/**
 * Text cursor between some tokens.
 */
export class Cursor {

    private readonly tokens: readonly Token[];
    private tokenIndex: number;
    private nextToken_?: Token;
    constructor(tokens: Token[]) {
        if ( tokens.length === 0 ) {
            throw new Error("required not empty array of tokens");
        }
        this.tokens = tokens;
        this.tokenIndex = 0;
        this.nextToken_ = this.tokens[ this.tokenIndex ];
    }

    get nextToken(): Token | undefined {
        return this.nextToken_;
    }

    /**
     * returns true if next token value is equal someTokenValue,
     * returns false if this is end of tokens
     */
    before(someTokenValue: string): boolean {
        if ( !this.nextToken_ ) {
            return false;
        }

        return this.nextToken_.value === someTokenValue;
    }

    /**
     * returns true if there are no more tokens ahead
     */
    atTheEnd(): this is {nextToken: undefined} {
        return !this.nextToken_;
    }

    /**
     * move cursor if next token value is correct,
     * else throw error
     */
    read(expectedToken: string): void {
        if ( !this.nextToken_ ) {
            throw new Error(`reached end of code, but expected token: "${expectedToken}"`);
        }

        if ( this.nextToken_.value !== expectedToken ) {
            throw new Error([
                `unexpected token: "${this.nextToken_.value}",`,
                `expected: "${expectedToken}"`
            ].join(" "));
        }

        this.next();
    }

    /**
     * move cursor position before token
     */
    setPositionBefore(token: Token): void {
        // TODO: check -1
        this.tokenIndex = this.tokens.indexOf(token);
        this.nextToken_ = this.tokens[ this.tokenIndex ];
    }

    /**
     * skip only one token
     */
    skipOne(SkipThisTokenClass: TokenClass): void {
        if ( this.nextToken_ instanceof SkipThisTokenClass ) {
            this.next();
        }
    }

    /**
     * skip sequence of tokens
     */
    skipAll(SkipThisTokenClass: TokenClass): void {
        while ( this.nextToken_ instanceof SkipThisTokenClass ) {
            this.next();
        }
    }

    /**
     * move cursor position to next token
     */
    next(): void {
        this.tokenIndex++;
        this.nextToken_ = this.tokens[ this.tokenIndex ];
    }
}