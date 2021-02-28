/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createClass } from "./util";
import assert from "assert";

describe("AbstractNode.findParentInstance.spec.ts", () => {

    describe("node.findParentInstance(SomeNode)", () => {
        const TestNode = createClass<{child?: any}>();

        it("no parent", () => {
            const node = new TestNode({row: {}});
            const result = node.findParentInstance(TestNode);
            assert.strictEqual(result, undefined);
        });

        it("one parent", () => {
            const child = new TestNode({row: {}});
            const parent = new TestNode({row: {
                child
            }});

            const result = child.findParentInstance(TestNode);
            assert.ok(result === parent);
        });

        it("find concrete parent", () => {
            const SelectNode = createClass<{child?: any}>();
            const ExpressionNode = createClass<{child?: any}>();

            const childExpression = new ExpressionNode({row: {}});
            const parentExpression = new ExpressionNode({row: {
                child: childExpression
            }});
            const select = new SelectNode({row: {
                child: parentExpression
            }});

            assert.ok(
                childExpression.findParentInstance(SelectNode) === select,
                "find SelectNode"
            );
            assert.ok(
                childExpression.findParentInstance(ExpressionNode) === parentExpression,
                "find ExpressionNode"
            );
        });

    });

});