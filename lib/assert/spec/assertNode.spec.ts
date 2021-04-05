import assert from "assert";
import { DigitsToken, SpaceToken, WordToken } from "../../token";
import { Cursor } from "../../cursor";
import { SyntaxError } from "../../source";
import { AbstractNode, Spaces, _ } from "../../node";
import { assertNode, SuccessTest } from "../assertNode";

describe("assertNode", () => {

    interface OperatorRow {
        left: string;
        operator: string;
        right: string;
    }
    class BaseOperator extends AbstractNode<OperatorRow> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        static entry(cursor: Cursor) {
            return true;
        }

        static parse(cursor: Cursor): OperatorRow {
            const left = cursor.read(DigitsToken).value;
            cursor.skipAll(SpaceToken);

            const operator = cursor.nextToken.value;
            cursor.skipOne();

            cursor.skipAll(SpaceToken);
            const right = cursor.read(DigitsToken).value;

            return {left, operator, right};
        }

        template() {
            const {left, operator, right} = this.row;
            return [left, _, operator, _, right];
        }
    }

    let TestNode!: typeof BaseOperator;
    beforeEach(() => {
        TestNode = class TestNode extends BaseOperator {};
    });

    describe("invalid parsing results", () => {

        const test: SuccessTest<BaseOperator> = {
            input: "1+ 2",
            shouldBe: {
                json: {
                    left: "1",
                    operator: "+",
                    right: "2"
                },
                pretty: "1 + 2",
                minify: "1+2"
            }
        };

        it("invalid json", () => {
            TestNode.prototype.toJSON = function() {
                return {left: "wrong", operator: "+", right: "2"};
            };

            assert.throws(() => {
                assertNode(TestNode, test);
            }, (err: Error) =>
                err instanceof assert.AssertionError &&
                JSON.stringify(err.expected) === JSON.stringify(test.shouldBe.json) &&
                JSON.stringify(err.actual) === JSON.stringify({
                    left: "wrong",
                    operator: "+",
                    right: "2"
                }) &&
                err.message.includes("invalid json on input:\n1+ 2\n\n")
            );
        });

        it("invalid pretty", () => {
            TestNode.prototype.toString = function() {
                return "wrong";
            };

            assert.throws(() => {
                assertNode(TestNode, test);
            }, (err: Error) =>
                err instanceof assert.AssertionError &&
                err.expected === "1 + 2" &&
                err.actual === "wrong" &&
                err.message.includes("invalid pretty on input:\n1+ 2\n\n")
            );
        });

        it("invalid minify", () => {
            TestNode.prototype.toString = function(spaces: Spaces) {
                const originalString = BaseOperator.prototype.toString.call(this, spaces);
                if ( originalString === test.shouldBe.minify ) {
                    return "wrong";
                }

                return originalString;
            };

            assert.throws(() => {
                assertNode(TestNode, test);
            }, (err: Error) =>
                err instanceof assert.AssertionError &&
                err.expected === "1+2" &&
                err.actual === "wrong" &&
                err.message.includes("invalid minify on input:\n1+ 2\n\n")
            );
        });

        it("invalid parsing pretty", () => {
            TestNode.parse = function(cursor: Cursor): OperatorRow {
                if ( cursor.source.tokens.join("") === test.shouldBe.pretty ) {
                    return {
                        left: "100",
                        operator: "+",
                        right: "2"
                    };
                }
                return BaseOperator.parse(cursor);
            };

            assert.throws(() => {
                assertNode(TestNode, test);
            }, (err: Error) =>
                err instanceof assert.AssertionError &&
                JSON.stringify(err.expected) === JSON.stringify(test.shouldBe.json) &&
                JSON.stringify(err.actual) === JSON.stringify({
                    left: "100",
                    operator: "+",
                    right: "2"
                }) &&
                err.message.includes("invalid json on pretty:\n1 + 2\n\n")
            );
        });

        it("invalid parsing minify", () => {
            TestNode.parse = function(cursor: Cursor): OperatorRow {
                if ( cursor.source.tokens.join("") === test.shouldBe.minify ) {
                    return {
                        left: "1",
                        operator: "+",
                        right: "200"
                    };
                }
                return BaseOperator.parse(cursor);
            };

            assert.throws(() => {
                assertNode(TestNode, test);
            }, (err: Error) =>
                err instanceof assert.AssertionError &&
                JSON.stringify(err.expected) === JSON.stringify(test.shouldBe.json) &&
                JSON.stringify(err.actual) === JSON.stringify({
                    left: "1",
                    operator: "+",
                    right: "200"
                }) &&
                err.message.includes("invalid json on minify:\n1+2\n\n")
            );
        });

        it("invalid entry input", () => {
            TestNode.entry = function() {
                return false;
            };

            assert.throws(() => {
                assertNode(TestNode, test);
            }, (err: Error) =>
                err instanceof assert.AssertionError &&
                err.expected === true &&
                err.actual === false &&
                err.message.includes("invalid entry on input:\n1+ 2\n\n")
            );
        });

        it("invalid entry pretty", () => {
            TestNode.entry = function(cursor: Cursor) {
                if ( cursor.source.tokens.join("") === test.shouldBe.pretty ) {
                    return false;
                }
                return true;
            };

            assert.throws(() => {
                assertNode(TestNode, test);
            }, (err: Error) =>
                err instanceof assert.AssertionError &&
                err.expected === true &&
                err.actual === false &&
                err.message.includes("invalid entry on pretty:\n1 + 2\n\n")
            );
        });


        it("invalid entry minify", () => {
            TestNode.entry = function(cursor: Cursor) {
                if ( cursor.source.tokens.join("") === test.shouldBe.minify ) {
                    return false;
                }
                return true;
            };

            assert.throws(() => {
                assertNode(TestNode, test);
            }, (err: Error) =>
                err instanceof assert.AssertionError &&
                err.expected === true &&
                err.actual === false &&
                err.message.includes("invalid entry on minify:\n1+2\n\n")
            );
        });


        it("parsed callback", () => {
            interface StringNodeRow {
                string: string;
            }
            class StringNode extends AbstractNode<StringNodeRow> {
                // istanbul ignore next
                static entry() {
                    return true;
                }

                static parse(cursor: Cursor): StringNodeRow {
                    const string = cursor.read(WordToken).value;
                    return {string};
                }

                template() {
                    return this.row.string;
                }

                toValue(): string {
                    return "wrong";
                }
            }

            assert.throws(() => {
                assertNode(StringNode, {
                    input: "hello",
                    shouldBe: {
                        json: {
                            string: "hello"
                        },

                        parsed: (node) => {
                            assert.strictEqual(node.toValue(), "hello");
                        }
                    }
                });
            }, (err: Error) =>
                err instanceof assert.AssertionError &&
                err.expected === "hello" &&
                err.actual === "wrong"
            );
        });

        it("every child node should have position", () => {
            const someRow = {
                left: "x",
                operator: "+",
                right: "y"
            };
            const row = {
                ...someRow,
                childArr: [
                    new TestNode({row: someRow})
                ],
                childObj: {
                    x: new TestNode({row: someRow})
                },
                recursion: new TestNode({
                    row: {
                        ...someRow,
                        ...({
                            childArr: [
                                new TestNode({row: someRow})
                            ],
                            childObj: {
                                x: new TestNode({row: someRow})
                            }
                        } as unknown as OperatorRow)
                    }
                })
            } as unknown as OperatorRow;

            TestNode.parse = function() {
                return row;
            };
            const json = new TestNode({row}).toJSON();

            assert.throws(() => {
                assertNode(TestNode, {
                    input: "x + y",
                    shouldBe: {
                        json,
                        minify: "x+y"
                    }
                });
            }, (err: Error) =>
                err.message.includes("on input:\nx + y") &&
                err.message.includes("required node position for every child") &&
                err.message.includes("invalid node: ")
            );
        });

    });

    describe("valid parsing", () => {

        it("success parsing test", () => {
            assertNode(TestNode, {
                input: "100 -3",
                shouldBe: {
                    json: {left: "100", operator: "-", right: "3"},
                    pretty: "100 - 3",
                    minify: "100-3"
                }
            });
        });

        it("pretty by default is input", () => {
            assertNode(TestNode, {
                input: "100 - 3",
                shouldBe: {
                    json: {left: "100", operator: "-", right: "3"},
                    minify: "100-3"
                }
            });
        });

        it("minify by default is input", () => {
            assertNode(TestNode, {
                input: "100-3",
                shouldBe: {
                    json: {left: "100", operator: "-", right: "3"},
                    pretty: "100 - 3"
                }
            });
        });

        it("error parsing test", () => {
            TestNode.parse = function(cursor: Cursor): OperatorRow {
                throw SyntaxError.at({
                    source: cursor.source,
                    message: "expected operator"
                });
            };

            assertNode(TestNode, {
                input: "200",
                throws: /expected operator/
            });
        });
    });

    describe("invalid errors", () => {

        it("missing exception", () => {
            assert.throws(() => {
                assertNode(TestNode, {
                    input: "200 + 200",
                    throws: /expected operator/
                });
            }, (err: Error) =>
                err.message.includes("Missing expected exception")
            );
        });

    });

});