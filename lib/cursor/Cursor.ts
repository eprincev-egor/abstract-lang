import {
    Token, TokenClass,
    EndOfFleToken, SpaceToken, EndOfLineToken
} from "../token";
import {
    AbstractNode,
    AnyRow,
    NodeClass,
    NodeParams,
    NodePosition
} from "../node";
import { Source, SyntaxError } from "../source";
import { last } from "../util";

/** Text cursor between some tokens */
export class Cursor {

    readonly source: Source;
    private tokenIndex: number;
    private nextToken_: Token;
    private Comments: NodeClass<any>[];
    constructor(source: Source, Comments: NodeClass<any>[] = []) {
        if ( source.tokens.length === 0 ) {
            throw new Error("required not empty array of tokens");
        }
        const endToken = last(source.tokens);
        if ( !(endToken instanceof EndOfFleToken) ) {
            throw new TypeError("required special token EOF after last token");
        }

        this.source = source;
        this.tokenIndex = 0;
        this.nextToken_ = source.tokens[ this.tokenIndex ];
        this.Comments = Comments;
    }

    /** text cursor is before this token */
    get nextToken(): Token {
        return this.nextToken_;
    }

    /**
     * returns true if next token value is equal someTokenValue,
     * returns false if this is end of tokens
     */
    beforeValue<T extends string>(someTokenValue: T): boolean {
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

    /** returns true if cursor before one of this Nodes */
    beforeOneOf<TClass extends NodeClass<any>>(
        Nodes: readonly TClass[]
    ): boolean {
        for (const Node of Nodes) {
            if ( this.before(Node) ) {
                return true;
            }
        }
        return false;
    }

    /** returns true if next token.value.toLowerCase() === word */
    beforeWord(word: string): boolean {
        return this.nextToken_.value.toLowerCase() === word;
    }

    /** check next tokens values or classes */
    beforeSequence(...shouldBeTokensOrValues: (string | TokenClass)[]): boolean {
        let tokenIndex = this.tokenIndex;
        let nextToken = this.nextToken_;

        // little speedup
        if (
            typeof shouldBeTokensOrValues[0] === "string" &&
            nextToken.value !== shouldBeTokensOrValues[0]
        ) {
            return false;
        }

        let result = true;
        for (const shouldBe of shouldBeTokensOrValues) {
            if ( nextToken instanceof EndOfFleToken ) {
                result = false;
                break;
            }

            if ( typeof shouldBe === "string" ) {
                if ( nextToken.value !== shouldBe ) {
                    result = false;
                    break;
                }
            }
            else if ( !(nextToken instanceof shouldBe) ) {
                result = false;
                break;
            }

            tokenIndex++;
            nextToken = this.source.tokens[ tokenIndex ];
        }

        return result;
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
        this.skipSpaces();

        return actualWord;
    }

    /** returns true if cursor before series of words (ignore case) */
    beforePhrase(...words: string[]): boolean {
        const startToken = this.nextToken_;
        const tokenIndex = this.tokenIndex;

        for (const word of words) {

            if ( this.nextToken_.value.toLowerCase() !== word ) {
                this.nextToken_ = startToken;
                this.tokenIndex = tokenIndex;
                return false;
            }

            this.next();
            this.skipSpaces();
        }

        this.nextToken_ = startToken;
        this.tokenIndex = tokenIndex;
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

    /** read all next tokens with same classes */
    readAll(...Tokens: TokenClass[]): Token[] {
        const result: Token[] = [];
        while (
            Tokens.some((SomeToken) =>
                this.nextToken_ instanceof SomeToken
            )
        ) {
            const token = this.readAnyOne();
            result.push(token);
        }

        return result;
    }

    /** returns any one token and move position */
    readAnyOne(): Token {
        if ( this.beforeEnd() ) {
            this.throwError("reached end of code, but expected any token");
        }

        const anyOneToken = this.nextToken_;
        this.next();
        return anyOneToken;
    }

    /** call Node.parse and return node instance */
    parse<TNode extends AbstractNode<AnyRow>>(Node: NodeClass<TNode>): TNode {
        const start = this.nextToken_.position;
        const row = Node.parse(this);
        const end = this.nextToken_.position;

        const node = new Node({
            row,
            source: this.source,
            position: { start, end }
        });
        return node;
    }

    /** correctly create node with source and position */
    create<TRow extends AnyRow, TNode extends AbstractNode<AnyRow>>(
        Node: new (params: NodeParams<TRow>) => TNode,
        startFrom: Token | AbstractNode<AnyRow> | number,
        row: TRow
    ): TNode {
        const position: NodePosition = {
            start: extrudePositionStart(startFrom),
            end: this.nextToken_.position
        };
        return new Node({
            source: this.source,
            position,
            row
        });
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

            this.skipSpaces();

            if ( delimiter ) {
                if ( !this.beforeValue(delimiter) ) {
                    break;
                }
                this.readValue(delimiter);
                this.skipSpaces();
            }
            else if ( !this.before(Node) ) {
                break;
            }

        } while ( !this.beforeEnd() );

        return nodes;
    }

    /** returns one of the Nodes if there is a cursor before of it */
    tryParseOneOf<TClass extends NodeClass<any>>(
        Nodes: readonly TClass[]
    ): InstanceType<TClass> | undefined {
        for (const Node of Nodes) {
            if ( this.before(Node) ) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return this.parse(Node);
            }
        }
    }

    /**
     * returns one of the Nodes if there is a cursor before of it,
     * else throw error
     */
    parseOneOf<TClass extends NodeClass<any>>(
        Nodes: readonly TClass[],
        errorMessage: string
    ): InstanceType<TClass> {
        const node = this.tryParseOneOf(Nodes);
        if ( !node ) {
            this.throwError(errorMessage);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return node;
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

    /** skip all next tokens with same classes */
    skipAll(...SkipTokens: TokenClass[]): void {
        while (
            SkipTokens.some((SkipThisTokenClass) =>
                this.nextToken_ instanceof SkipThisTokenClass
            )
        ) {
            this.next();
        }
    }

    /** skip all spaces tokens or comments */
    skipSpaces(): void {
        while ( !this.beforeEnd() ) {
            if (
                this.nextToken_ instanceof EndOfLineToken ||
                this.nextToken_ instanceof SpaceToken
            ) {
                this.next();
                continue;
            }

            let hasComment = false;
            for (const Comment of this.Comments) {
                if ( this.before(Comment) ) {
                    this.parse(Comment);
                    hasComment = true;
                    break;
                }
            }
            if ( hasComment ) {
                continue;
            }
            break;
        }
    }

    /** throw syntax error at near current position */
    throwError(message: string, target?: Token | AbstractNode<AnyRow>): never {
        throw SyntaxError.at({
            source: this.source,
            message,
            target: target || this.nextToken_
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

function extrudePositionStart(
    startFrom: Token | AbstractNode<AnyRow> | number
): number {
    if ( startFrom instanceof Token ) {
        return startFrom.position;
    }

    if ( startFrom instanceof AbstractNode ) {
        if ( !startFrom.position ) {
            throw new Error("cannot detect start node position");
        }
        return startFrom.position.start;
    }

    return startFrom;
}