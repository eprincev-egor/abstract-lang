import * as assert from "assert";
import { Cursor } from "../Cursor";
import { AbstractNode } from "../../node";
import {
    Token, Tokenizer,
    defaultMap,
    WordToken
} from "../../token";

describe("Cursor.node.spec.ts node methods", () => {

    let tokens!: Token[];
    let cursor!: Cursor;
    beforeEach(() => {
        tokens = Tokenizer.tokenize(
            defaultMap,
            "hello world"
        );
        cursor = new Cursor(tokens);
    });

    interface WordRow {
        word: string;
    }
    class WordNode extends AbstractNode<WordRow> {

        static entry(cursor: Cursor) {
            return cursor.beforeToken(WordToken);
        }

        static parse(cursor: Cursor): WordRow {
            const word = cursor.read(WordToken).value;
            return {word};
        }

        template() {
            return this.row.word;
        }
    }

    describe("parse(Node)", () => {

        it("call Node.parse and return node instance", () => {
            const node = cursor.parse(WordNode);
            assert.deepEqual( node.row, {word: "hello"} );
            assert.ok( cursor.beforeValue(" ") );
        });

        it("correct node.start and node.end position", () => {
            const node = cursor.parse(WordNode);
            assert.strictEqual( node.start, 0 );
            assert.strictEqual( node.end, 5 );
        });
    });

    it("before(Node)", () => {
        assert.ok( cursor.before(WordNode), "valid entry" );

        cursor.next();
        assert.ok( !cursor.before(WordNode), "not valid entry" );
    });

    describe("parseChainOf(Node, delimiter)", () => {

        it("parse sequence of nodes over some delimiter", () => {

            const tokens = Tokenizer.tokenize(
                defaultMap,
                "first,second , third\n,\rfour,\tfive"
            );
            const cursor = new Cursor(tokens);

            const words = cursor.parseChainOf(WordNode, ",");
            assert.deepStrictEqual(
                words.map((node) => node.row.word),
                ["first", "second", "third", "four", "five"]
            );
        });

        it("parse sequence of nodes without delimiter", () => {
            const tokens = Tokenizer.tokenize(
                defaultMap,
                "first \t second\nthird!stop"
            );
            const cursor = new Cursor(tokens);

            const words = cursor.parseChainOf(WordNode);
            assert.deepStrictEqual(
                words.map((node) => node.row.word),
                ["first", "second", "third"]
            );
            assert.ok( cursor.beforeValue("!"), "correct position after parsing" );
        });

        it("throw an error if the next token is wrong", () => {
            const tokens = Tokenizer.tokenize(
                defaultMap,
                " "
            );
            const cursor = new Cursor(tokens);

            assert.throws(() => {
                cursor.parseChainOf(WordNode, ";");
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
                cursor.parseChainOf(WordNode, ";");
            }, (err: Error) =>
                /unexpected token DigitsToken\("123"\), expected: WordToken/.test(err.message)
            );
        });
    });


});
