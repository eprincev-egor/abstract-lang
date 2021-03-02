import { humans, empty, oneChild } from "./fixture";
import assert from "assert";

const getAnyParent = () => true;

describe("AbstractNode.filterParents.spec.ts", () => {

    describe("node.filterParents(cb(node) => boolean)", () => {

        it("no parent", () => {
            const result = empty.filterParents(getAnyParent);
            assert.deepStrictEqual(result, []);
        });

        it("one parent", () => {
            const result = oneChild.child.filterParents(getAnyParent);
            assert.strictEqual(result.length, 1);
            assert.ok(result[0] === oneChild.parent);
        });

        it("find concrete parents", () => {
            const result = humans.leaf.filterParents((node) =>
                node.row.name === "oliver" ||
                node.row.name === "jack"
            );
            assert.strictEqual(result.length, 2);
            assert.ok(result[0] === humans.jack, "found jack");
            assert.ok(result[1] === humans.oliver, "found oliver");
        });

    });

});