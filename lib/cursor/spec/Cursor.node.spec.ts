import assert from "assert";
import { Cursor } from "../Cursor";
import { AbstractNode } from "../../node";
import { SourceFile, SyntaxError } from "../../source";
import {
    WordToken,
    DigitsToken,
    SpaceToken
} from "../../token";

describe("Cursor.node.spec.ts node methods", () => {

    let file!: SourceFile;
    let cursor!: Cursor;
    beforeEach(() => {
        file = new SourceFile({
            path: "test.txt",
            content: "hello world"
        });
        cursor = file.cursor;
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

        // istanbul ignore next
        template() {
            return this.row.word;
        }
    }

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
                    cursor.skipAll(SpaceToken);

                    const operator = cursor.nextToken.value;
                    cursor.skipOne();

                    cursor.skipAll(SpaceToken);
                    const right = Operator.parseOperand(cursor);

                    return {left, operator, right};
                }

                static parseOperand(cursor: Cursor): string | Operator {
                    if ( cursor.beforeValue("(") ) {
                        cursor.skipOne();
                        cursor.skipAll(SpaceToken);

                        const operator = cursor.parse(Operator);

                        cursor.skipAll(SpaceToken);
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

            file = new SourceFile({
                path: "test",
                content: "(1 + 2) - (3 + 4)"
            });
            cursor = file.cursor;

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
        });
    });

    it("before(Node)", () => {
        assert.ok( cursor.before(WordNode), "valid entry" );

        cursor.next();
        assert.ok( !cursor.before(WordNode), "not valid entry" );
    });

    describe("parseChainOf(Node, delimiter)", () => {

        it("parse sequence of nodes over some delimiter", () => {
            file = new SourceFile({
                path: "test",
                content: "first,second , third\n,\rfour,\tfive"
            });
            const cursor = file.cursor;

            const words = cursor.parseChainOf(WordNode, ",");
            assert.deepStrictEqual(
                words.map((node) => node.row.word),
                ["first", "second", "third", "four", "five"]
            );
        });

        it("parse sequence of nodes without delimiter", () => {
            file = new SourceFile({
                path: "test",
                content: "first \t second\nthird!stop"
            });
            const cursor = file.cursor;

            const words = cursor.parseChainOf(WordNode);
            assert.deepStrictEqual(
                words.map((node) => node.row.word),
                ["first", "second", "third"]
            );
            assert.ok( cursor.beforeValue("!"), "correct position after parsing" );
        });

        it("throw an error if the next token is wrong", () => {
            file = new SourceFile({
                path: "test",
                content: " "
            });
            const cursor = file.cursor;

            assert.throws(() => {
                cursor.parseChainOf(WordNode, ";");
            }, (err: Error) =>
                err instanceof SyntaxError &&
                /unexpected token SpaceToken\(" "\), expected: WordToken/.test(err.message)
            );
        });

        it("throw an error if the next token after delimiter is wrong", () => {
            file = new SourceFile({
                path: "test",
                content: "hello;123"
            });
            const cursor = file.cursor;

            assert.throws(() => {
                cursor.parseChainOf(WordNode, ";");
            }, (err: Error) =>
                err instanceof SyntaxError &&
                /unexpected token DigitsToken\("123"\), expected: WordToken/.test(err.message)
            );
        });
    });


});
