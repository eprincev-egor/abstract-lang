import * as assert from "assert";
import { Cursor } from "../Cursor";
import { Tokenizer } from "../Tokenizer";
import { defaultMap } from "../default/defaultMap";
import { Token } from "../Token";

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

    it("read('wrong') throw error, if next token have another value", () => {
        assert.throws(() => {
            cursor.read("world");
        }, (err: Error) =>
            /unexpected token: "hello", expected: "world"/.test(err.message)
        );
    });

    it("cursor.setBefore(world)", () => {
        const hello = tokens[0];
        const world = tokens[2];

        cursor.moveBefore(world);
        assert.ok( cursor.before("world"), "now before world" );

        cursor.moveBefore(hello);
        assert.ok( cursor.before("hello"), "now before hello" );
    });

});

// cursor.skip(TokenConstructor);
// cursor.beforeWord("xx");
// cursor.readWord("xx");
// cursor.readPhrase("a", "b", "c");
// cursor.readChainOf(Syntax, separator);