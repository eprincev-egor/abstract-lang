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

    class WordNode extends AbstractNode {

        static entry(cursor: Cursor) {
            return cursor.beforeToken(WordToken);
        }

        static parse(cursor: Cursor): WordNode {
            const word = cursor.read(WordToken).value;
            return new WordNode(word);
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

    describe("parse(Node)", () => {

        it("call Node.parse and return node instance", () => {
            const node = cursor.parse(WordNode);
            assert.strictEqual( node.word, "hello" );
            assert.ok( cursor.beforeValue(" ") );
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
                words.map((node) => node.word),
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
