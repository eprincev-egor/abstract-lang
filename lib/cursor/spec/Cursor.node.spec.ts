import assert from "assert";
import { Cursor } from "../Cursor";
import { SyntaxError } from "../../source";
import { WordNode, Operator } from "./fixture";
import { TestLang } from "./TestLang";

describe("Cursor.node.spec.ts node methods", () => {

    let cursor!: Cursor;
    beforeEach(() => {
        cursor = TestLang.code("hello world").cursor;
    });

    describe("parse(Node)", () => {

        it("call Node.parse and return node instance", () => {
            const node = cursor.parse(WordNode);
            assert.deepStrictEqual( node.row, {word: "hello"} );
            assert.ok( cursor.beforeValue(" ") );
        });

        it("correct node.start and node.end position", () => {
            const node = cursor.parse(WordNode);
            assert.deepStrictEqual(node.position, {
                start: 0,
                end: 5
            });
        });

        it("set node.parent", () => {

            const {cursor, source: code} = TestLang.code("(1 + 2) - (3 + 4)");

            const node = cursor.parse(Operator);

            assert.ok( node.row.left instanceof Operator, "left is operator" );
            assert.ok( node.row.left.parent === node, "correct left parent" );
            assert.deepStrictEqual( node.row.left.row, {
                left: "1",
                operator: "+",
                right: "2"
            });

            assert.strictEqual( node.row.operator, "-" );

            assert.ok( node.row.right instanceof Operator, "right is operator" );
            assert.ok( node.row.left.parent === node, "correct right parent" );
            assert.deepStrictEqual( node.row.right.row, {
                left: "3",
                operator: "+",
                right: "4"
            });

            assert.strictEqual( node.source, code );
        });
    });

    it("before(Node)", () => {
        assert.ok( cursor.before(WordNode), "valid entry" );

        cursor.next();
        assert.ok( !cursor.before(WordNode), "not valid entry" );
    });

    describe("parseChainOf(Node, delimiter)", () => {

        it("parse sequence of nodes over some delimiter", () => {
            const {cursor} = TestLang.code(
                "first,second , third\n,\rfour,\tfive"
            );

            const words = cursor.parseChainOf(WordNode, ",");
            assert.deepStrictEqual(
                words.map((node) => node.row.word),
                ["first", "second", "third", "four", "five"]
            );
        });

        it("parse sequence of nodes without delimiter", () => {
            const {cursor} = TestLang.code(
                "first \t second\nthird!stop"
            );

            const words = cursor.parseChainOf(WordNode);
            assert.deepStrictEqual(
                words.map((node) => node.row.word),
                ["first", "second", "third"]
            );
            assert.ok( cursor.beforeValue("!"), "correct position after parsing" );
        });

        it("throw an error if the next token is wrong", () => {
            const {cursor} = TestLang.code(" ");

            assert.throws(() => {
                cursor.parseChainOf(WordNode, ";");
            }, (err: Error) =>
                err instanceof SyntaxError &&
                /unexpected token SpaceToken\(" "\), expected: WordToken/.test(err.message)
            );
        });

        it("throw an error if the next token after delimiter is wrong", () => {
            const {cursor} = TestLang.code("hello;123");

            assert.throws(() => {
                cursor.parseChainOf(WordNode, ";");
            }, (err: Error) =>
                err instanceof SyntaxError &&
                /unexpected token DigitsToken\("123"\), expected: WordToken/.test(err.message)
            );
        });
    });

});
