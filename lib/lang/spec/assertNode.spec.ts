import assert from "assert";
import { DigitsToken, SpaceToken, WordToken } from "../../token";
import { Cursor } from "../../cursor";
import { AbstractNode, Spaces, _ } from "../../node";
import { SuccessTest } from "../assertNode";
import { AbstractLang } from "../AbstractLang";

describe("assertNode", () => {

    class TestLang extends AbstractLang {}

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
                TestLang.assertNode(TestNode, test);
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
                TestLang.assertNode(TestNode, test);
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
                TestLang.assertNode(TestNode, test);
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
                TestLang.assertNode(TestNode, test);
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
                TestLang.assertNode(TestNode, test);
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
                TestLang.assertNode(TestNode, test);
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
                TestLang.assertNode(TestNode, test);
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
                TestLang.assertNode(TestNode, test);
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
                TestLang.assertNode(StringNode, {
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
                TestLang.assertNode(TestNode, {
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
            TestLang.assertNode(TestNode, {
                input: "100 -3",
                shouldBe: {
                    json: {left: "100", operator: "-", right: "3"},
                    pretty: "100 - 3",
                    minify: "100-3"
                }
            });
        });

        it("pretty by default is input", () => {
            TestLang.assertNode(TestNode, {
                input: "100 - 3",
                shouldBe: {
                    json: {left: "100", operator: "-", right: "3"},
                    minify: "100-3"
                }
            });
        });

        it("minify by default is input", () => {
            TestLang.assertNode(TestNode, {
                input: "100-3",
                shouldBe: {
                    json: {left: "100", operator: "-", right: "3"},
                    pretty: "100 - 3"
                }
            });
        });

        it("error parsing test", () => {
            TestNode.parse = function(cursor: Cursor): OperatorRow {
                cursor.throwError("expected operator");
            };

            TestLang.assertNode(TestNode, {
                input: "200",
                throws: /expected operator/
            });
        });

        it("valid error.target token.value: strictEqual", () => {
            TestNode.parse = function(cursor: Cursor): OperatorRow {
                cursor.throwError(
                    "message",
                    cursor.source.tokens[2]
                );
            };

            TestLang.assertNode(TestNode, {
                input: "50+60",
                throws: /message/,
                target: "60"
            });
        });

        it("valid error.target node.toString(): strictEqual", () => {
            TestNode.parse = function(cursor: Cursor): OperatorRow {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const testNode = Object.create(AbstractNode.prototype);
                testNode.position = {
                    start: 3,
                    end: 5
                };
                testNode.toString = () => {
                    return "60";
                };

                cursor.throwError(
                    "message",
                    testNode
                );
            };

            TestLang.assertNode(TestNode, {
                input: "50+60",
                throws: /message/,
                target: "60"
            });
        });

        it("valid error.target token.value: regexp pattern", () => {
            TestNode.parse = function(cursor: Cursor): OperatorRow {
                cursor.throwError(
                    "message",
                    cursor.source.tokens[2]
                );
            };

            TestLang.assertNode(TestNode, {
                input: "50+60",
                throws: /message/,
                target: /6/
            });
        });

        it("json can contain numbers", () => {
            interface SelectRow {
                limit: number;
            }
            class Select extends AbstractNode<SelectRow> {

                static entry = TestNode.entry.bind(TestNode);

                static parse(cursor: Cursor): SelectRow {
                    cursor.readWord("limit");
                    const limit = +cursor.readAll(DigitsToken).join("");
                    return {limit};
                }

                template() {
                    return `limit ${this.row.limit}`;
                }
            }

            TestLang.assertNode(Select, {
                input: "limit 120",
                shouldBe: {
                    json: {
                        limit: 120
                    }
                }
            });
        });

    });

    describe("invalid errors", () => {

        it("missing exception", () => {
            assert.throws(() => {
                TestLang.assertNode(TestNode, {
                    input: "200 + 200",
                    throws: /expected operator/
                });
            }, (err: Error) =>
                err.message.includes("Missing expected exception") &&
                err.message.includes("200 + 200")
            );
        });

        it("invalid error instance", () => {
            TestNode.parse = function(): OperatorRow {
                throw new Error("some error");
            };

            assert.throws(() => {
                TestLang.assertNode(TestNode, {
                    input: "101",
                    throws: /some error/
                });
            }, (err: Error) =>
                err instanceof assert.AssertionError &&
                err.message.includes("101") &&
                err.message.includes("error should be SyntaxError instance")
            );
        });

        it("invalid target token.value", () => {
            TestNode.parse = function(cursor: Cursor): OperatorRow {
                cursor.throwError("some error");
            };

            assert.throws(() => {
                TestLang.assertNode(TestNode, {
                    input: "400 - 100",
                    throws: /some error/,
                    target: "100"
                });
            }, (err: Error) =>
                err instanceof assert.AssertionError &&
                err.message.includes("invalid error target") &&
                err.expected === "100" &&
                err.actual === "400"
            );
        });

        it("invalid target token.value, regexp pattern", () => {
            TestNode.parse = function(cursor: Cursor): OperatorRow {
                cursor.throwError("some error");
            };

            assert.throws(() => {
                TestLang.assertNode(TestNode, {
                    input: "400 - 100",
                    throws: /some error/,
                    target: /100/
                });
            }, (err: Error) =>
                err instanceof assert.AssertionError &&
                err.message.includes("invalid error target") &&
                err.message.includes("400 - 100")
            );
        });

    });

});