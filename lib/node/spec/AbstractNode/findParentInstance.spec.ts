import {
    TestNode,
    SelectNode, ExpressionNode,
    oneChild, empty
} from "./fixture";
import assert from "assert";

describe("AbstractNode/findParentInstance.spec.ts", () => {

    describe("node.findParentInstance(SomeNode)", () => {

        it("no parent", () => {
            const result = empty.findParentInstance(TestNode);
            assert.strictEqual(result, undefined);
        });

        it("one parent", () => {
            const result = oneChild.child.findParentInstance(TestNode);
            assert.ok(result === oneChild.parent);
        });

        it("find concrete parent", () => {
            const childExpression = new ExpressionNode(() => ({row: {}}));
            const parentExpression = new ExpressionNode(() => ({row: {
                child: childExpression
            }}));
            const select = new SelectNode(() => ({row: {
                child: parentExpression
            }}));

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