import { empty, oneChild, humans } from "./fixture";
import assert from "assert";

const getAnyChild = () => true;

describe("AbstractNode.filterChildren.spec.ts", () => {

    describe("node.filterChildren(cb(node) => boolean)", () => {

        it("no children", () => {
            const result = empty.filterChildren(getAnyChild);
            assert.deepStrictEqual(result, []);
        });

        it("one child", () => {
            const result = oneChild.parent.filterChildren(getAnyChild);
            assert.strictEqual(result.length, 1);
            assert.ok(result[0] === oneChild.child);
        });

        it("find concrete children", () => {
            const result = humans.root.filterChildren((node) =>
                node.row.name === "bob" ||
                node.row.name === "jack"
            );
            assert.strictEqual(result.length, 2);
            assert.ok(result[0] === humans.jack);
            assert.ok(result[1] === humans.bob);
        });

    });

});