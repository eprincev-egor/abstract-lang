import assert from "assert";
import { DigitsToken, SpaceToken } from "../../token";
import { Cursor } from "../../cursor";
import { AbstractNode, Spaces, _ } from "../../node";
import { assertNode, SuccessTest } from "../assertNode";
import { SyntaxError } from "cursor/SyntaxError";

describe("assertNode", () => {

    interface OperatorRow {
        left: string;
        operator: string;
        right: string;
    }
    class BaseOperator extends AbstractNode<OperatorRow> {
        static entry() {
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
            json: {
                left: "1",
                operator: "+",
                right: "2"
            },
            pretty: "1 + 2",
            minify: "1+2"
        };

        it("invalid json", () => {
            TestNode.prototype.toJSON = function() {
                return {left: "wrong", operator: "+", right: "2"};
            };

            assert.throws(() => {
                assertNode(TestNode, test);
            }, (err: Error) =>
                err instanceof assert.AssertionError &&
                JSON.stringify(err.expected) === JSON.stringify(test.json) &&
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
                if ( originalString === test.minify ) {
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
                if ( cursor.tokens.join("") === test.pretty ) {
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
                JSON.stringify(err.expected) === JSON.stringify(test.json) &&
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
                if ( cursor.tokens.join("") === test.minify ) {
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
                JSON.stringify(err.expected) === JSON.stringify(test.json) &&
                JSON.stringify(err.actual) === JSON.stringify({
                    left: "1",
                    operator: "+",
                    right: "200"
                }) &&
                err.message.includes("invalid json on minify:\n1+2\n\n")
            );
        });

    });

    describe("valid parsing", () => {

        it("success parsing test", () => {
            assertNode(TestNode, {
                input: "100 -3",
                json: {left: "100", operator: "-", right: "3"},
                pretty: "100 - 3",
                minify: "100-3"
            });
        });

        it("error parsing test", () => {
            TestNode.parse = function(cursor: Cursor): OperatorRow {
                throw SyntaxError.at(cursor, "expected operator");
            };

            assertNode(TestNode, {
                input: "200",
                error: /expected operator/
            });
        });
    });

    describe("invalid errors", () => {

        it("missing exception", () => {
            assert.throws(() => {
                assertNode(TestNode, {
                    input: "200 + 200",
                    error: /expected operator/
                });
            }, (err: Error) =>
                err.message.includes("Missing expected exception")
            );
        });

    });

});