import { createClass } from "./util";
import assert from "assert";

const getAnyParent = () => true;

describe("AbstractNode.filterParents.spec.ts", () => {

    describe("node.filterParents(cb(node) => boolean)", () => {
        const TestNode = createClass<any>();

        it("no parent", () => {
            const node = new TestNode({row: {}});
            const result = node.filterParents(getAnyParent);
            assert.deepStrictEqual(result, []);
        });

        it("one parent", () => {
            const child = new TestNode({row: {}});
            const parent = new TestNode({row: {
                child
            }});

            const result = child.filterParents(getAnyParent);
            assert.strictEqual(result.length, 1);
            assert.ok(result[0] === parent);
        });

        it("find concrete parents", () => {
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

            const result = bob.filterParents((node) =>
                node.row.name === "oliver" ||
                node.row.name === "jack"
            );
            assert.strictEqual(result.length, 2);
            assert.ok(result[0] === jack, "found jack");
            assert.ok(result[1] === oliver, "found oliver");
        });

    });

});