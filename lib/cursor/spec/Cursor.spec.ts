import * as assert from "assert";
import { Cursor } from "../Cursor";
import { SyntaxError } from "../SyntaxError";
import { AbstractSyntax } from "../../syntax";
import {
    Token, Tokenizer,
    defaultMap,
    SpaceToken,
    WordToken,
    EndOfFleToken,
    DigitsToken,
    EolToken
} from "../../token";

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

    it("beforeToken(TokenClass)", () => {
        assert.ok( cursor.beforeToken(WordToken) );
        assert.ok( !cursor.beforeToken(SpaceToken) );
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

    it("read(TokenClass)", () => {
        const hello = cursor.read(WordToken).value;
        assert.strictEqual( hello, "hello" );

        const space = cursor.read(SpaceToken).value;
        assert.strictEqual( space, " " );

        const world = cursor.read(WordToken).value;
        assert.strictEqual( world, "world" );
    });

    it("read(WrongToken) throw an error if the next token has a different class", () => {
        assert.throws(() => {
            cursor.read(SpaceToken);
        }, (err: Error) =>
            /unexpected token WordToken\("hello"\), expected: SpaceToken/.test(err.message)
        );
    });

    it("read(...) throw an error if the next token is EOF", () => {
        cursor.next();
        cursor.next();
        cursor.next();

        assert.throws(() => {
            cursor.read(WordToken);
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

    it("skipAll(...) don't change position if the next token has a different class", () => {
        tokens = [
            new SpaceToken(" ", 0),
            new EolToken("\r", 1),
            new SpaceToken(" ", 2),
            new EolToken("\n", 3),
            new WordToken("correct", 4),
            new EndOfFleToken(11)
        ];
        cursor = new Cursor(tokens);

        cursor.skipAll(WordToken);
        assert.ok( cursor.beforeValue(" ") );
    });

    it("skipAll(A, B, C, ...) skip all tokens with same classes", () => {
        tokens = [
            new SpaceToken(" ", 0),
            new EolToken("\r", 1),
            new SpaceToken(" ", 2),
            new EolToken("\n", 3),
            new WordToken("correct", 4),
            new EndOfFleToken(11)
        ];
        cursor = new Cursor(tokens);

        cursor.skipAll(SpaceToken, EolToken);
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

            numb += cursor.read(DigitsToken).value;

            if ( cursor.beforeValue(".") ) {
                numb += cursor.readValue(".");
                numb += cursor.read(DigitsToken).value;
            }

            if ( cursor.beforeValue("e") || cursor.beforeValue("E") ) {
                numb += "e";
                cursor.skipOne(WordToken);

                numb += cursor.read(DigitsToken).value;
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

            static entry(cursor: Cursor) {
                return cursor.beforeToken(WordToken);
            }

            static parse(cursor: Cursor): PhraseSyntax {
                let phrase = "";
                do {
                    phrase += cursor.nextToken.value;
                    cursor.next();
                } while (
                    cursor.beforeToken(SpaceToken) ||
                    cursor.beforeToken(WordToken)
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

    it("before(Syntax)", () => {
        class NullLiteral extends AbstractSyntax {

            static entry(cursor: Cursor) {
                return cursor.beforeValue("null");
            }

            static parse(cursor: Cursor): NullLiteral {
                cursor.readValue("null");
                return new NullLiteral();
            }

            // eslint-disable-next-line class-methods-use-this
            template(): string {
                return "null";
            }
        }

        tokens = Tokenizer.tokenize(
            defaultMap,
            "null"
        );
        cursor = new Cursor(tokens);
        assert.ok( cursor.before(NullLiteral), "valid entry" );


        tokens = Tokenizer.tokenize(
            defaultMap,
            "hello"
        );
        cursor = new Cursor(tokens);
        assert.ok( !cursor.before(NullLiteral), "not valid entry" );
    });

    describe("parseChainOf(Syntax, delimiter)", () => {
        class WordSyntax extends AbstractSyntax {

            static entry(cursor: Cursor) {
                return cursor.beforeToken(WordToken);
            }

            static parse(cursor: Cursor): WordSyntax {
                const word = cursor.read(WordToken).value;
                return new WordSyntax(word);
            }

            readonly word: string;
            protected constructor(word: string) {
                super();
                this.word = word;
            }

            protected template() {
                return this.word;
            }
        }

        it("parse sequence of syntax over some delimiter", () => {

            const tokens = Tokenizer.tokenize(
                defaultMap,
                "first,second , third\n,\rfour,\tfive"
            );
            const cursor = new Cursor(tokens);

            const words = cursor.parseChainOf(WordSyntax, ",");
            assert.deepStrictEqual(
                words.map((syntax) => syntax.word),
                ["first", "second", "third", "four", "five"]
            );
        });

        it("throw an error if the next token is wrong", () => {
            const tokens = Tokenizer.tokenize(
                defaultMap,
                " "
            );
            const cursor = new Cursor(tokens);

            assert.throws(() => {
                cursor.parseChainOf(WordSyntax, ";");
            }, (err: Error) =>
                /unexpected token SpaceToken\(" "\), expected: WordToken/.test(err.message)
            );
        });

        it("throw an error if the next token after delimiter is wrong", () => {
            const tokens = Tokenizer.tokenize(
                defaultMap,
                "hello;123"
            );
            const cursor = new Cursor(tokens);

            assert.throws(() => {
                cursor.parseChainOf(WordSyntax, ";");
            }, (err: Error) =>
                /unexpected token DigitsToken\("123"\), expected: WordToken/.test(err.message)
            );
        });
    });

    it("throwError(message) => SyntaxError", () => {
        cursor.read(WordToken);

        let actualError: unknown = new Error("expected error");
        try {
            cursor.throwError("test");
        }
        catch (error) {
            actualError = error;
        }

        assert.ok( actualError instanceof SyntaxError );
        assert.strictEqual( actualError.coords.line, 1, "valid line" );
        assert.strictEqual( actualError.coords.column, 6, "valid column" );
        assert.strictEqual( actualError.token, cursor.nextToken, "valid token" );
    });

});

// cursor.beforeWord("xx");
// cursor.readWord("xx");
// cursor.readPhrase("a", "b", "c");