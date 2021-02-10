import * as assert from "assert";
import { Cursor } from "../Cursor";
import { Tokenizer } from "../Tokenizer";
import { defaultMap } from "../default/defaultMap";
import { Token } from "../Token";
import { SpaceToken } from "../default/SpaceToken";
import { WordToken } from "../default/WordToken";
import { Position } from "../Position";
import { EndOfFleToken } from "../EndOfFileToken";

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
                new Token("test", new Position(0, 4))
            ]);
        }, (err: Error) =>
            /required special token EOF after last token/.test(err.message)
        );
    });

    it("before('hello')", () => {
        assert.ok( cursor.before("hello") );
        assert.ok( !cursor.before("world") );
    });

    it("readValue('hello')", () => {
        cursor.readValue("hello");
        assert.ok( cursor.before(" ") );
    });

    it("readValue('wrong') throw an error if the next token has a different value", () => {
        assert.throws(() => {
            cursor.readValue("world");
        }, (err: Error) =>
            /unexpected token: "hello", expected: "world"/.test(err.message)
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
            cursor.before("world"),
            "set position before world, now before world"
        );

        cursor.setPositionBefore(hello);
        assert.ok(
            cursor.before("hello"),
            "set position before hello, now before hello"
        );
    });

    it("next() move cursor on one token", () => {
        cursor.next();
        assert.ok( cursor.before(" "), "now before space" );

        cursor.next();
        assert.ok( cursor.before("world"), "now before world" );
    });

    it("beforeEndToken()", () => {
        cursor.next();
        assert.ok( !cursor.beforeEndToken() );

        cursor.next();
        cursor.next();
        assert.ok( cursor.beforeEndToken() );
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
            new SpaceToken(" ", new Position(0, 1)),
            new SpaceToken(" ", new Position(1, 2)),
            new WordToken("correct", new Position(2, 9)),
            new EndOfFleToken(new Position(9, 9))
        ];
        cursor = new Cursor(tokens);

        cursor.skipOne(SpaceToken);
        assert.ok( cursor.before(" "), "skipped one token" );
    });

    it("skipAll(TokenClass) skip all tokens with same class", () => {
        tokens = [
            new SpaceToken(" ", new Position(0, 1)),
            new SpaceToken(" ", new Position(1, 2)),
            new WordToken("correct", new Position(2, 9)),
            new EndOfFleToken(new Position(9, 9))
        ];
        cursor = new Cursor(tokens);

        cursor.skipAll(SpaceToken);
        assert.ok( cursor.before("correct"), "before correct token" );
    });

});

// cursor.beforeWord("xx");
// cursor.readWord("xx");
// cursor.readPhrase("a", "b", "c");
// cursor.readChainOf(Syntax, separator);