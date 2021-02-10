import * as assert from "assert";
import { Cursor } from "../Cursor";
import { Tokenizer } from "../Tokenizer";
import { defaultMap } from "../default/defaultMap";
import { Token } from "../Token";
import { SpaceToken } from "../default/SpaceToken";
import { WordToken } from "../default/WordToken";
import { Position } from "../Position";

describe("Token", () => {

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

    it("before('hello')", () => {
        assert.ok( cursor.before("hello") );
        assert.ok( !cursor.before("world") );
    });

    it("read('hello')", () => {
        cursor.read("hello");
        assert.ok( cursor.before(" ") );
    });

    it("read('wrong') throw an error if the next token has a different value", () => {
        assert.throws(() => {
            cursor.read("world");
        }, (err: Error) =>
            /unexpected token: "hello", expected: "world"/.test(err.message)
        );
    });

    it("read('after rend') throw an error if reached end of tokens", () => {
        cursor.next();
        cursor.next();
        cursor.next();

        assert.throws(() => {
            cursor.read("missed");
        }, (err: Error) =>
            /reached end of code, but expected token: "missed"/.test(err.message)
        );
    });

    it("cursor.setBefore(world)", () => {
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

    it("cursor.next() move cursor on one token", () => {
        cursor.next();
        assert.ok( cursor.before(" "), "now before space" );

        cursor.next();
        assert.ok( cursor.before("world"), "now before world" );
    });

    it("cursor.atTheEnd()", () => {
        cursor.next();
        cursor.next();
        cursor.next();
        assert.ok( cursor.atTheEnd() );
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
        cursor.next();

        assert.strictEqual( cursor.nextToken, undefined );
    });

    it("cursor.skipAll(TokenClass)", () => {
        cursor.skipAll(WordToken);
        assert.ok( cursor.before(" "), "now before space" );

        cursor.skipAll(SpaceToken);
        assert.ok( cursor.before("world"), "now before world" );
    });

    it("cursor.skipAll(TokenClass) skip all tokens with same class", () => {
        tokens = [
            new SpaceToken(" ", new Position(0, 1)),
            new SpaceToken(" ", new Position(1, 2)),
            new WordToken("correct", new Position(2, 9))
        ];
        cursor = new Cursor(tokens);

        cursor.skipAll(SpaceToken);
        assert.ok( cursor.before("correct"), "now before correct token" );
    });

    it("cursor.skipOne(TokenClass) skip only one token with same class", () => {
        tokens = [
            new SpaceToken(" ", new Position(0, 1)),
            new SpaceToken(" ", new Position(1, 2)),
            new WordToken("correct", new Position(2, 9))
        ];
        cursor = new Cursor(tokens);

        cursor.skipOne(SpaceToken);
        assert.ok( cursor.before(" "), "skipped one token" );
    });

});

// cursor.beforeWord("xx");
// cursor.readWord("xx");
// cursor.readPhrase("a", "b", "c");
// cursor.readChainOf(Syntax, separator);