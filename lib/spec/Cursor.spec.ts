import * as assert from "assert";
import { Cursor } from "../Cursor";
import { AbstractSyntax } from "../syntax/AbstractSyntax";
import {
    Token, Tokenizer,
    defaultMap,
    SpaceToken,
    WordToken,
    EndOfFleToken,
    DigitsToken
} from "../token";

describe("Cursor", () => {

    let tokens!: Token[];
    let cursor!: Cursor;
    beforeEach(() => {
        tokens = Tokenizer.tokenize(
            defaultMap,
            "hello world"
        );
        cursor = new Cursor(tokens);
    });

    it("required not empty array of tokens", () => {
        assert.throws(() => {
            new Cursor([]);
        }, (err: Error) =>
            /required not empty array of tokens/.test(err.message)
        );
    });

    it("required EOF at last token", () => {
        assert.throws(() => {
            new Cursor([
                new Token("test", 0)
            ]);
        }, (err: Error) =>
            /required special token EOF after last token/.test(err.message)
        );
    });

    it("beforeValue('hello')", () => {
        assert.ok( cursor.beforeValue("hello") );
        assert.ok( !cursor.beforeValue("world") );
    });

    it("before(TokenClass)", () => {
        assert.ok( cursor.before(WordToken) );
        assert.ok( !cursor.before(SpaceToken) );
    });

    it("readValue('hello')", () => {
        const result = cursor.readValue("hello");
        assert.strictEqual( result, "hello" );
        assert.ok( cursor.beforeValue(" ") );
    });

    it("readValue('wrong') throw an error if the next token has a different value", () => {
        assert.throws(() => {
            cursor.readValue("world");
        }, (err: Error) =>
            /unexpected token: "hello", expected: "world"/.test(err.message)
        );
    });

    it("readValue(...) throw an error if the next token is EOF", () => {
        cursor.next();
        cursor.next();
        cursor.next();

        assert.throws(() => {
            cursor.readValue("missed");
        }, (err: Error) =>
            /reached end of code, but expected token: "missed"/.test(err.message)
        );
    });

    it("readToken(TokenClass)", () => {
        const hello = cursor.readToken(WordToken).value;
        assert.strictEqual( hello, "hello" );

        const space = cursor.readToken(SpaceToken).value;
        assert.strictEqual( space, " " );

        const world = cursor.readToken(WordToken).value;
        assert.strictEqual( world, "world" );
    });

    it("readToken(WrongToken) throw an error if the next token has a different class", () => {
        assert.throws(() => {
            cursor.readToken(SpaceToken);
        }, (err: Error) =>
            /unexpected token WordToken\("hello"\), expected: SpaceToken/.test(err.message)
        );
    });

    it("readToken(...) throw an error if the next token is EOF", () => {
        cursor.next();
        cursor.next();
        cursor.next();

        assert.throws(() => {
            cursor.readToken(WordToken);
        }, (err: Error) =>
            /reached end of code, but expected token: WordToken/.test(err.message)
        );
    });

    it("next() cannot move position after last token", () => {
        cursor.next();
        cursor.next();
        cursor.next();

        assert.throws(() => {
            cursor.next();
        }, (err: Error) =>
            /reached end of tokens/.test(err.message)
        );
    });

    it("setPositionBefore(world)", () => {
        const hello = tokens[0];
        const world = tokens[2];

        cursor.setPositionBefore(world);
        assert.ok(
            cursor.beforeValue("world"),
            "set position before world, now before world"
        );

        cursor.setPositionBefore(hello);
        assert.ok(
            cursor.beforeValue("hello"),
            "set position before hello, now before hello"
        );
    });

    it("next() move cursor on one token", () => {
        cursor.next();
        assert.ok( cursor.beforeValue(" "), "now before space" );

        cursor.next();
        assert.ok( cursor.beforeValue("world"), "now before world" );
    });

    it("beforeEndToken()", () => {
        cursor.next();
        assert.ok( !cursor.beforeEnd() );

        cursor.next();
        cursor.next();
        assert.ok( cursor.beforeEnd() );
    });

    it("valid cursor.nextToken property", () => {
        assert.ok( cursor.nextToken instanceof WordToken );
        assert.strictEqual( cursor.nextToken.value, "hello" );
        cursor.next();

        assert.ok( cursor.nextToken instanceof SpaceToken );
        assert.strictEqual( cursor.nextToken.value, " " );
        cursor.next();

        assert.ok( cursor.nextToken instanceof WordToken );
        assert.strictEqual( cursor.nextToken.value, "world" );
    });

    it("skipOne(TokenClass) skip only one token with same class", () => {
        tokens = [
            new SpaceToken(" ", 0),
            new SpaceToken(" ", 1),
            new WordToken("correct", 2),
            new EndOfFleToken(9)
        ];
        cursor = new Cursor(tokens);

        cursor.skipOne(SpaceToken);
        assert.ok( cursor.beforeValue(" "), "skipped one token" );
    });

    it("skipOne() don't change position if the next token has a different class", () => {
        cursor.skipOne(SpaceToken);
        assert.ok( cursor.beforeValue("hello") );
    });

    it("skipAll(TokenClass) skip all tokens with same class", () => {
        tokens = [
            new SpaceToken(" ", 0),
            new SpaceToken(" ", 1),
            new WordToken("correct", 2),
            new EndOfFleToken(9)
        ];
        cursor = new Cursor(tokens);

        cursor.skipAll(SpaceToken);
        assert.ok( cursor.beforeValue("correct"), "before correct token" );
    });

    it("usage example: parse single quotes", () => {

        const escape = "\\";
        const quote = "'";

        function parseQuotes(text: string) {
            const tokens = Tokenizer.tokenize(
                defaultMap,
                text
            );
            const cursor = new Cursor(tokens);

            // require open quote
            cursor.readValue(quote);
            let content = "";

            while ( !cursor.beforeValue(quote) && !cursor.beforeEnd() ) {

                if ( cursor.beforeValue(escape) ) {
                    cursor.readValue(escape);

                    const someValue = cursor.nextToken.value;
                    const escapedCharCode = someValue[0];
                    const escapedChar = eval(`"\\${escapedCharCode}"`) as string;

                    content += escapedChar;
                    content += someValue.slice(1);
                }
                else {
                    content += cursor.nextToken.value;
                }

                cursor.next();
            }

            // require close quote
            cursor.readValue(quote);
            return content;
        }

        const quotesContent = parseQuotes("'hello \\'\\nworld\"'");
        assert.strictEqual(quotesContent, "hello '\nworld\"");
    });

    it("usage example: number literal", () => {

        // eslint-disable-next-line unicorn/consistent-function-scoping
        function parseNumber(text: string): number {
            const tokens = Tokenizer.tokenize(
                defaultMap,
                text
            );
            const cursor = new Cursor(tokens);

            let numb = "";
            if ( cursor.beforeValue("-") ) {
                numb += cursor.readValue("-");
            }

            numb += cursor.readToken(DigitsToken).value;

            if ( cursor.beforeValue(".") ) {
                numb += cursor.readValue(".");
                numb += cursor.readToken(DigitsToken).value;
            }

            if ( cursor.beforeValue("e") || cursor.beforeValue("E") ) {
                numb += "e";
                cursor.skipOne(WordToken);

                numb += cursor.readToken(DigitsToken).value;
            }

            return +numb;
        }

        assert.strictEqual( parseNumber("1"), 1 );
        assert.strictEqual( parseNumber("-1"), -1 );
        assert.strictEqual( parseNumber("1.10"), 1.1 );
        assert.strictEqual( parseNumber("-1.10"), -1.1 );
        assert.strictEqual( parseNumber("1e3"), 1000 );
        assert.strictEqual( parseNumber("1E10"), 1e10 );
        assert.strictEqual( parseNumber("123456700.123E2"), 12345670012.3 );
        assert.strictEqual( parseNumber("1e2w3"), 100 );
    });

    it("parse(Syntax) call Syntax.parse and return syntax instance", () => {
        class PhraseSyntax extends AbstractSyntax {
            static parse(cursor: Cursor): PhraseSyntax {
                let phrase = "";
                do {
                    phrase += cursor.nextToken.value;
                    cursor.next();
                } while (
                    cursor.before(SpaceToken) ||
                    cursor.before(WordToken)
                );
                return new PhraseSyntax(phrase);
            }

            readonly phrase: string;
            protected constructor(phrase: string) {
                super();
                this.phrase = phrase;
            }

            protected template() {
                return this.phrase;
            }
        }

        const syntax = cursor.parse(PhraseSyntax);
        assert.strictEqual( syntax.phrase, "hello world" );
        assert.ok( cursor.beforeEnd() );
    });

});

// cursor.beforeWord("xx");
// cursor.readWord("xx");
// cursor.readPhrase("a", "b", "c");
// cursor.readChainOf(Syntax, separator);