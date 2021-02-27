import * as assert from "assert";
import { Cursor } from "../Cursor";
import { AbstractNode } from "../../node";
import {
    Token, Tokenizer,
    defaultMap,
    SpaceToken,
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

    it("parse(Node) call Node.parse and return node instance", () => {
        class PhraseNode extends AbstractNode {

            static entry(cursor: Cursor) {
                return cursor.beforeToken(WordToken);
            }

            static parse(cursor: Cursor): PhraseNode {
                let phrase = "";
                do {
                    phrase += cursor.nextToken.value;
                    cursor.next();
                } while (
                    cursor.beforeToken(SpaceToken) ||
                    cursor.beforeToken(WordToken)
                );
                return new PhraseNode(phrase);
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

        const node = cursor.parse(PhraseNode);
        assert.strictEqual( node.phrase, "hello world" );
        assert.ok( cursor.beforeEnd() );
    });

    it("before(Node)", () => {
        class NullLiteral extends AbstractNode {

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

    describe("parseChainOf(Node, delimiter)", () => {

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
