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

    it("cursor.before('hello')", () => {
        assert.ok( cursor.before("hello") );
        assert.ok( !cursor.before("world") );
    });

    it("cursor.read('hello')", () => {
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

    it("cursor.skip(TokenClass)", () => {
        cursor.skip(WordToken);
        assert.ok( cursor.before(" "), "now before space" );

        cursor.skip(SpaceToken);
        assert.ok( cursor.before("world"), "now before world" );
    });

    it("cursor.skip(TokenClass) skip all tokens with same class", () => {
        tokens = [
            new SpaceToken(" ", new Position(0, 1)),
            new SpaceToken(" ", new Position(1, 2)),
            new WordToken("correct", new Position(2, 9))
        ];
        cursor = new Cursor(tokens);

        cursor.skip(SpaceToken);
        assert.ok( cursor.before("correct"), "now before correct token" );
    });

});

// cursor.beforeWord("xx");
// cursor.readWord("xx");
// cursor.readPhrase("a", "b", "c");
// cursor.readChainOf(Syntax, separator);