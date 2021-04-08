import assert from "assert";
import { Cursor } from "../Cursor";
import { AbstractNode } from "../../node";
import { SourceCode, SyntaxError } from "../../source";
import { DigitsToken } from "../../token";
import { WordNode, Hello, World } from "./fixture";

describe("Cursor.node.spec.ts node methods", () => {

    let code!: SourceCode;
    let cursor!: Cursor;
    beforeEach(() => {
        code = new SourceCode({
            text: "hello world"
        });
        cursor = code.cursor;
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
            interface OperatorRow {
                left: string | Operator;
                operator: string;
                right: string | Operator;
            }
            class Operator extends AbstractNode<OperatorRow> {
                // istanbul ignore next
                static entry() {
                    return true;
                }

                static parse(cursor: Cursor): OperatorRow {
                    const left = Operator.parseOperand(cursor);
                    cursor.skipSpaces();

                    const operator = cursor.nextToken.value;
                    cursor.skipOne();

                    cursor.skipSpaces();
                    const right = Operator.parseOperand(cursor);

                    return {left, operator, right};
                }

                static parseOperand(cursor: Cursor): string | Operator {
                    if ( cursor.beforeValue("(") ) {
                        cursor.skipOne();
                        cursor.skipSpaces();

                        const operator = cursor.parse(Operator);

                        cursor.skipSpaces();
                        cursor.readValue(")");

                        return operator;
                    }

                    const numb = cursor.read(DigitsToken).value;
                    return numb;
                }

                // istanbul ignore next
                template() {
                    const {left, operator, right} = this.row;
                    return [left, operator, right];
                }
            }

            code = new SourceCode({
                text: "(1 + 2) - (3 + 4)"
            });
            cursor = code.cursor;

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
            code = new SourceCode({
                text: "first,second , third\n,\rfour,\tfive"
            });
            const cursor = code.cursor;

            const words = cursor.parseChainOf(WordNode, ",");
            assert.deepStrictEqual(
                words.map((node) => node.row.word),
                ["first", "second", "third", "four", "five"]
            );
        });

        it("parse sequence of nodes without delimiter", () => {
            code = new SourceCode({
                text: "first \t second\nthird!stop"
            });
            const cursor = code.cursor;

            const words = cursor.parseChainOf(WordNode);
            assert.deepStrictEqual(
                words.map((node) => node.row.word),
                ["first", "second", "third"]
            );
            assert.ok( cursor.beforeValue("!"), "correct position after parsing" );
        });

        it("throw an error if the next token is wrong", () => {
            code = new SourceCode({
                text: " "
            });
            const cursor = code.cursor;

            assert.throws(() => {
                cursor.parseChainOf(WordNode, ";");
            }, (err: Error) =>
                err instanceof SyntaxError &&
                /unexpected token SpaceToken\(" "\), expected: WordToken/.test(err.message)
            );
        });

        it("throw an error if the next token after delimiter is wrong", () => {
            code = new SourceCode({
                text: "hello;123"
            });
            const cursor = code.cursor;

            assert.throws(() => {
                cursor.parseChainOf(WordNode, ";");
            }, (err: Error) =>
                err instanceof SyntaxError &&
                /unexpected token DigitsToken\("123"\), expected: WordToken/.test(err.message)
            );
        });
    });

    describe("tryParseOneOf(Node[])", () => {

        it("return second", () => {
            const result = cursor.tryParseOneOf([World, Hello]);
            assert.ok(result instanceof Hello);
            assert.strictEqual(result.toString(), "hello");
        });

        it("return first", () => {
            const result = cursor.tryParseOneOf([Hello, World]);
            assert.ok(result instanceof Hello);
            assert.strictEqual(result.toString(), "hello");
        });

        it("return second, after some parsing", () => {
            cursor.readWord("hello");

            const result = cursor.tryParseOneOf([Hello, World]);
            assert.ok(result instanceof World);
            assert.strictEqual(result.toString(), "world");
        });

        it("return undefined", () => {
            cursor.readPhrase("hello", "world");

            const result = cursor.tryParseOneOf([World, Hello]);
            assert.strictEqual(result, undefined);
        });

    });

    describe("parseOneOf(Node[])", () => {

        it("return second", () => {
            const result = cursor.parseOneOf([World, Hello], "some");
            assert.ok(result instanceof Hello);
            assert.strictEqual(result.toString(), "hello");
        });

        it("return first", () => {
            const result = cursor.parseOneOf([Hello, World], "error");
            assert.ok(result instanceof Hello);
            assert.strictEqual(result.toString(), "hello");
        });

        it("throw error", () => {
            cursor.readPhrase("hello", "world");

            assert.throws(() => {
                cursor.parseOneOf([World, Hello], "custom error message");
            }, (err: Error) =>
                /custom error message/.test(err.message) &&
                err instanceof SyntaxError
            );
        });

    });

    describe("beforeOneOf(Node[])", () => {

        it("return true on second", () => {
            const result = cursor.beforeOneOf([World, Hello]);
            assert.strictEqual(result, true);
        });

        it("return true on first", () => {
            const result = cursor.beforeOneOf([Hello, World]);
            assert.strictEqual(result, true);
        });

        it("return false", () => {
            cursor.readPhrase("hello", "world");

            const result = cursor.beforeOneOf([Hello, World]);
            assert.strictEqual(result, false);
        });

    });


});
