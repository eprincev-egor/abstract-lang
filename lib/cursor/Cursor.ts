import {
    Token, TokenClass,
    EndOfFleToken, SpaceToken, EndOfLineToken
} from "../token";
import {
    AbstractNode,
    AnyRow,
    NodeClass
} from "../node";
import { Source, SyntaxError } from "../source";
import { last } from "../util";

/** Text cursor between some tokens */
export class Cursor {

    readonly source: Source;
    private tokenIndex: number;
    private nextToken_: Token;
    constructor(file: Source) {
        if ( file.tokens.length === 0 ) {
            throw new Error("required not empty array of tokens");
        }
        const endToken = last(file.tokens);
        if ( !(endToken instanceof EndOfFleToken) ) {
            throw new TypeError("required special token EOF after last token");
        }

        this.source = file;
        this.tokenIndex = 0;
        this.nextToken_ = file.tokens[ this.tokenIndex ];
    }

    /** text cursor is before this token */
    get nextToken(): Token {
        return this.nextToken_;
    }

    /**
     * returns true if next token value is equal someTokenValue,
     * returns false if this is end of tokens
     */
    beforeValue<T extends string>(someTokenValue: T): this is {
        nextToken: Token & {value: T};
    } {
        return this.nextToken_.value === someTokenValue;
    }

    /** returns true if next token has correct instance type */
    beforeToken<T extends TokenClass>(TokenClass: T): this is {
        nextToken: InstanceType<T> & {
            constructor: T;
        };
    } {
        return this.nextToken_ instanceof TokenClass;
    }

    /** returns true if there are no more tokens ahead */
    beforeEnd(): this is {nextToken: EndOfFleToken} {
        return this.nextToken_ instanceof EndOfFleToken;
    }

    /** returns true if cursor before the Node */
    before<TNode extends AbstractNode<AnyRow>>(Node: NodeClass<TNode>): boolean {
        return Node.entry(this);
    }

    /** returns true if next token.value.toLowerCase() === word */
    beforeWord(word: string): boolean {
        return this.nextToken_.value.toLowerCase() === word;
    }

    /** move cursor if next token value is correct, else throw error */
    readValue<T extends string>(expectedTokenValue: T): T {
        if ( this.nextToken_.value !== expectedTokenValue ) {
            if ( this.beforeEnd() ) {
                this.throwError(
                    `reached end of code, but expected token: "${expectedTokenValue}"`
                );
            }

            this.throwError([
                `unexpected token: "${this.nextToken_.value}",`,
                `expected: "${expectedTokenValue}"`
            ].join(" "));
        }

        this.next();
        return expectedTokenValue;
    }

    /** move cursor if next token.value.toLowerCase() is correct, else throw error */
    readWord(expectedWord: string): string {
        const actualWord = this.nextToken_.value;

        if ( actualWord.toLowerCase() !== expectedWord ) {
            if ( this.beforeEnd() ) {
                this.throwError(
                    `reached end of code, but expected word: "${expectedWord}"`
                );
            }

            this.throwError([
                `unexpected token: "${actualWord}",`,
                `expected word: "${expectedWord}"`
            ].join(" "));
        }

        this.next();
        this.skipAll(SpaceToken, EndOfLineToken);

        return actualWord;
    }

    /** returns true if cursor before series of words (ignore case) */
    beforePhrase(...words: string[]): boolean {
        const startToken = this.nextToken_;
        for (const word of words) {

            if ( !this.beforeWord(word) ) {
                this.nextToken_ = startToken;
                return false;
            }

            this.next();
            this.skipAll(SpaceToken, EndOfLineToken);
        }

        this.nextToken_ = startToken;
        return true;
    }

    /** move cursor after this words or throw error */
    readPhrase(...expectedWords: string[]): string[] {
        const actualWords: string[] = [];
        for (const expectedWord of expectedWords) {
            const actualWord = this.readWord(expectedWord);
            actualWords.push( actualWord );
        }
        return actualWords;
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
            this.throwError([
                "reached end of code,",
                `but expected token: ${ExpectedTokenClass.name}`
            ].join(" "));
        }

        this.throwError([
            `unexpected token ${invalidTokenName}("${invalidToken.value}"),`,
            `expected: ${ExpectedTokenClass.name}`
        ].join(" "));
    }

    /** call Node.parse and return node instance */
    parse<TNode extends AbstractNode<AnyRow>>(Node: NodeClass<TNode>): TNode {
        const start = this.nextToken_.position;
        const row = Node.parse(this);
        const end = this.nextToken_.position;

        const node = new Node({
            row,
            position: { start, end }
        });
        return node;
    }

    /** parse a sequence of nodes separated by a some value */
    parseChainOf<TNode extends AbstractNode<AnyRow>>(
        Node: NodeClass<TNode>,
        delimiter?: string
    ): TNode[] {
        const nodes: TNode[] = [];

        do {
            const node = this.parse(Node);
            nodes.push(node);

            this.skipAll(SpaceToken, EndOfLineToken);

            if ( delimiter ) {
                if ( !this.beforeValue(delimiter) ) {
                    break;
                }
                this.readValue(delimiter);
                this.skipAll(SpaceToken, EndOfLineToken);
            }
            else if ( !this.before(Node) ) {
                break;
            }

        } while ( !this.beforeEnd() );

        return nodes;
    }

    /** move cursor position before token */
    setPositionBefore(token: Token): void {
        const tokenIndex = this.source.tokens.indexOf(token);
        if ( tokenIndex === -1 ) {
            throw new Error(`cannot set position before unknown token: "${token.value}"`);
        }

        this.tokenIndex = tokenIndex;
        this.nextToken_ = token;
    }

    /** skip just one token */
    skipOne(SkipThisTokenClass?: TokenClass): void {
        if ( !SkipThisTokenClass || this.nextToken_ instanceof SkipThisTokenClass ) {
            this.next();
        }
    }

    /** skip all tokens with same classes */
    skipAll(...SkipTokens: TokenClass[]): void {
        while (
            SkipTokens.some((SkipThisTokenClass) =>
                this.nextToken_ instanceof SkipThisTokenClass
            )
        ) {
            this.next();
        }
    }

    /** throw syntax error at near current position */
    throwError(message: string): never {
        throw SyntaxError.at({
            cursor: this,
            message
        });
    }

    /**
     * move cursor position to next token,
     * and throw error if no more tokens
     */
    next(): void {
        if ( this.beforeEnd() ) {
            this.throwError("cannot move cursor, reached end of tokens");
        }

        this.tokenIndex++;
        this.nextToken_ = this.source.tokens[ this.tokenIndex ];
    }
}
