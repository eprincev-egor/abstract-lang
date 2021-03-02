import { createClass } from "./util";
import assert from "assert";

const getAnyChild = () => true;

describe("AbstractNode.filterChildren.spec.ts", () => {

    describe("node.filterChildren(cb(node) => boolean)", () => {
        const TestNode = createClass<any>();

        it("no children", () => {
            const node = new TestNode({row: {}});
            const result = node.filterChildren(getAnyChild);
            assert.deepStrictEqual(result, []);
        });

        it("one child", () => {
            const child = new TestNode({row: {}});
            const parent = new TestNode({row: { child }});

            const result = parent.filterChildren(getAnyChild);
            assert.strictEqual(result.length, 1);
            assert.ok(result[0] === child);
        });

        it("find concrete children", () => {
            const bob = new TestNode({row: {
                name: "bob"
            }});
            const jack = new TestNode({row: {
                name: "jack",
                child: bob
            }});
            const jane = new TestNode({row: {
                name: "jane",
                child: jack
            }});
            const oliver = new TestNode({row: {
                name: "oliver",
                child: jane
            }});

            const result = oliver.filterChildren((node) =>
                node.row.name === "bob" ||
                node.row.name === "jack"
            );
            assert.strictEqual(result.length, 2);
            assert.ok(result[0] === jack);
            assert.ok(result[1] === bob);
        });

    });

});