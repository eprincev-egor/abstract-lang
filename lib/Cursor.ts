import { AbstractSyntax } from "./syntax/AbstractSyntax";
import { EndOfFleToken } from "./token/EndOfFileToken";
import { Token, TokenClass } from "./token/Token";

interface SyntaxClass<T extends AbstractSyntax> {
    parse(cursor: Cursor): T;
}

/**
 * Text cursor between some tokens.
 */
export class Cursor {

    private readonly tokens: readonly Token[];
    private tokenIndex: number;
    private nextToken_: Token;
    constructor(tokens: Token[]) {
        if ( tokens.length === 0 ) {
            throw new Error("required not empty array of tokens");
        }
        const endToken = tokens[ tokens.length - 1 ];
        if ( !(endToken instanceof EndOfFleToken) ) {
            throw new TypeError("required special token EOF after last token");
        }

        this.tokens = tokens;
        this.tokenIndex = 0;
        this.nextToken_ = this.tokens[ this.tokenIndex ];
    }

    get nextToken(): Token {
        return this.nextToken_;
    }

    /**
     * returns true if next token value is equal someTokenValue,
     * returns false if this is end of tokens
     */
    beforeValue(someTokenValue: string): boolean {
        return this.nextToken_.value === someTokenValue;
    }

    /**
     * returns true if next token has correct instance type
     */
    before(TokenClass: TokenClass): boolean {
        return this.nextToken_ instanceof TokenClass;
    }

    /**
     * returns true if there are no more tokens ahead
     */
    beforeEnd(): boolean {
        return this.nextToken instanceof EndOfFleToken;
    }

    /**
     * move cursor if next token value is correct,
     * else throw error
     */
    readValue(expectedTokenValue: string): string {
        if ( this.nextToken_.value !== expectedTokenValue ) {
            if ( this.beforeEnd() ) {
                throw new Error(`reached end of code, but expected token: "${expectedTokenValue}"`);
            }

            throw new Error([
                `unexpected token: "${this.nextToken_.value}",`,
                `expected: "${expectedTokenValue}"`
            ].join(" "));
        }

        this.next();
        return expectedTokenValue;
    }

    /**
     * move cursor if next token instance is correct and return this token,
     * else throw error
     */
    read<T extends TokenClass>(ExpectedTokenClass: T): InstanceType<T> {
        const token = this.nextToken_;

        if ( token instanceof ExpectedTokenClass ) {
            this.next();
            return token as InstanceType<T>;
        }

        const invalidToken = token as Token;
        const invalidTokenName = invalidToken.constructor.name;

        if ( this.beforeEnd() ) {
            throw new Error([
                "reached end of code,",
                `but expected token: ${ExpectedTokenClass.name}`
            ].join(" "));
        }

        throw new Error([
            `unexpected token ${invalidTokenName}("${invalidToken.value}"),`,
            `expected: ${ExpectedTokenClass.name}`
        ].join(" "));
    }

    parse<T extends AbstractSyntax>(Syntax: SyntaxClass<T>): T {
        return Syntax.parse(this);
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
     * skip just one token
     */
    skipOne(SkipThisTokenClass: TokenClass): void {
        if ( this.nextToken_ instanceof SkipThisTokenClass ) {
            this.next();
        }
    }

    /**
     * skip all tokens with same class
     */
    skipAll(SkipThisTokenClass: TokenClass): void {
        while ( this.nextToken_ instanceof SkipThisTokenClass ) {
            this.next();
        }
    }

    /**
     * move cursor position to next token,
     * and throw error if no more tokens
     */
    next(): void {
        if ( this.beforeEnd() ) {
            throw new Error("reached end of tokens");
        }

        this.tokenIndex++;
        this.nextToken_ = this.tokens[ this.tokenIndex ];
    }
}