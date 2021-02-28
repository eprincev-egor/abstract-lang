/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createClass } from "./util";
import assert from "assert";

describe("AbstractNode.filterChildrenByInstance.spec.ts", () => {

    describe("node.filterChildrenByInstance(SomeNode)", () => {
        const TestNode = createClass<{child?: any}>();

        it("no children", () => {
            const node = new TestNode({row: {}});
            const result = node.filterChildrenByInstance(TestNode);
            assert.deepStrictEqual(result, []);
        });

        it("one child", () => {
            const child = new TestNode({row: {}});
            const parent = new TestNode({row: {
                child
            }});

            const result = parent.filterChildrenByInstance(TestNode);
            assert.strictEqual(result.length, 1);
            assert.ok(result[0] === child);
        });

        it("many children", () => {
            const child1 = new TestNode({row: {}});
            const child2 = new TestNode({row: {
                child: child1
            }});

            const parent = new TestNode({row: {
                child: child2
            }});

            const result = parent.filterChildrenByInstance(TestNode);
            assert.strictEqual(result.length, 2);
            assert.ok(result[0] === child2);
            assert.ok(result[1] === child1);
        });

        it("filter correct instances", () => {
            const SelectNode = createClass<{child?: any}>();
            const ExpressionNode = createClass<{child?: any}>();

            const expression1 = new ExpressionNode({row: {}});
            const expression2 = new ExpressionNode({row: {
                child: expression1
            }});
            const childSelect1 = new SelectNode({row: {
                child: expression2
            }});
            const childSelect2 = new SelectNode({row: {
                child: childSelect1
            }});

            const parentSelect = new SelectNode({row: {
                child: childSelect2
            }});

            const result = parentSelect.filterChildrenByInstance(ExpressionNode);
            assert.strictEqual(result.length, 2);
            assert.ok(result[0] === expression2, "expression2");
            assert.ok(result[1] === expression1, "expression1");
        });
    });

});
