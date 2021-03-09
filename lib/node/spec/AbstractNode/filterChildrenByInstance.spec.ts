import {
    TestNode,
    ExpressionNode, SelectNode,
    empty, oneChild, infinityRecursion, primitive
} from "./fixture";
import assert from "assert";

describe("AbstractNode/filterChildrenByInstance.spec.ts", () => {

    describe("node.filterChildrenByInstance(SomeNode)", () => {

        it("no children", () => {
            const result = empty.filterChildrenByInstance(TestNode);
            assert.deepStrictEqual(result, []);
        });

        it("one child", () => {
            const result = oneChild.parent.filterChildrenByInstance(TestNode);
            assert.strictEqual(result.length, 1);
            assert.ok(result[0] === oneChild.child);
        });

        it("many children", () => {
            const child1 = new TestNode(() => ({row: {}}));
            const child2 = new TestNode(() => ({row: {
                child: child1
            }}));

            const parent = new TestNode(() => ({row: {
                child: child2
            }}));

            const result = parent.filterChildrenByInstance(TestNode);
            assert.strictEqual(result.length, 2);
            assert.ok(result[0] === child2);
            assert.ok(result[1] === child1);
        });

        it("filter correct instances", () => {
            const expression1 = new ExpressionNode(() => ({row: {
                child: false
            }}));
            const expression2 = new ExpressionNode(() => ({row: {
                child: expression1
            }}));
            const childSelect1 = new SelectNode(() => ({row: {
                child: expression2
            }}));
            const childSelect2 = new SelectNode(() => ({row: {
                child: childSelect1
            }}));

            const parentSelect = new SelectNode(() => ({row: {
                child: childSelect2
            }}));

            const result = parentSelect.filterChildrenByInstance(ExpressionNode);
            assert.strictEqual(result.length, 2);
            assert.ok(result[0] === expression2, "expression2");
            assert.ok(result[1] === expression1, "expression1");
        });

        it("infinity recursion", () => {
            const result = infinityRecursion.filterChildrenByInstance(TestNode);
            assert.strictEqual(result.length, 1);
        });

        it("scan array of models", () => {
            const node = new TestNode(() => ({row: {
                items: [empty.clone(), primitive.clone()]
            }}));
            const result = node.filterChildrenByInstance(TestNode);
            assert.strictEqual(result.length, 2);
        });

        it("scan dictionary of models", () => {
            const node = new TestNode(() => ({row: {
                dictionary: {
                    a: empty.clone(),
                    b: primitive.clone()
                }
            }}));
            const result = node.filterChildrenByInstance(TestNode);
            assert.strictEqual(result.length, 2);
        });

    });

});
