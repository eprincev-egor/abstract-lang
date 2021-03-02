import { infinityRecursion, TestNode } from "./fixture";
import assert from "assert";

describe("AbstractNode.parent.spec.ts", () => {

    describe("node.parent", () => {

        it("node.row contains primitive values and nodes", () => {
            const child = new TestNode({row: {
                a: new Date(),
                b: 1
            }});
            const parent = new TestNode({row: {
                a: new Date(),
                b: 2,
                c: child
            }});

            assert.ok( child.parent === parent );
        });

        it("node.row contains array of nodes", () => {
            const child1 = new TestNode({row: {
                children: []
            }});
            const child2 = new TestNode({row: {
                children: []
            }});
            const parent = new TestNode({row: {
                children: [child1, child2]
            }});

            assert.ok( child1.parent === parent, "child1" );
            assert.ok( child2.parent === parent, "child2" );
        });

        it("node.row contains matrix of nodes", () => {
            const child = new TestNode({row: {
                matrix: []
            }});
            const parent = new TestNode({row: {
                matrix: [[child]]
            }});

            assert.ok( child.parent === parent );
        });

        it("node.row contains dictionary of nodes", () => {
            const child1 = new TestNode({row: {
                dictionary: {}
            }});
            const child2 = new TestNode({row: {
                dictionary: {}
            }});
            const parent = new TestNode({row: {
                dictionary: {
                    a: child1,
                    b: child2
                }
            }});

            assert.ok( child1.parent === parent, "child1" );
            assert.ok( child2.parent === parent, "child2" );
        });

        it("node.row contains dictionary of dictionaries of nodes", () => {
            const child1 = new TestNode({row: {
                dictionary: {}
            }});
            const child2 = new TestNode({row: {
                dictionary: {}
            }});
            const parent = new TestNode({row: {
                dictionary: {
                    a: {x: child1},
                    b: {y: child2}
                }
            }});

            assert.ok( child1.parent === parent, "child1" );
            assert.ok( child2.parent === parent, "child2" );
        });

        it("node.row contains infinity recursion", () => {
            new TestNode({
                row: infinityRecursion.row
            });
            assert.ok(true, "no errors");
        });
    });

});
