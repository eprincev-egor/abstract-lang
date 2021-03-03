/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable unicorn/no-null */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
    empty,
    infinityRecursion,
    primitive,
    humans,
    TestNode
} from "./fixture";
import assert from "assert";

describe("AbstractNode.equal.spec.ts", () => {

    describe("node.equal(node)", () => {

        it("empty = empty", () => {
            const result = empty.equal( empty.clone() );
            assert.strictEqual(result, true);
        });

        it("empty != primitive", () => {
            const result = primitive.equal( empty );
            assert.strictEqual(result, false);
        });

        it("infinity recursion", () => {
            const result = infinityRecursion.equal( infinityRecursion.clone() );
            assert.strictEqual(result, true);
        });

        it("compare child models", () => {
            assert.strictEqual(
                humans.root.equal( humans.root.clone() ), true
            );
            assert.strictEqual(
                humans.leaf.equal( humans.root.clone() ), false
            );
        });

        it("compare same arrays of numbers", () => {
            const a = new TestNode({row: {
                arr: [1,2,3,4]
            }});
            const b = new TestNode({row: {
                arr: [1,2,3,4]
            }});

            assert.strictEqual( a.equal(b), true );
        });

        it("compare different arrays of numbers", () => {
            const a = new TestNode({row: {
                arr: [5,1]
            }});
            const b = new TestNode({row: {
                arr: [1,5]
            }});

            assert.strictEqual( a.equal(b), false );
        });

        it("compare arrays with different length", () => {
            const a = new TestNode({row: {
                arr: [1,2,3]
            }});
            const b = new TestNode({row: {
                arr: [1,2,3,4]
            }});

            assert.strictEqual( a.equal(b), false );
        });

        it("compare same objects", () => {
            const a = new TestNode({row: {
                obj: {a: 1, b: 2, c: 3}
            }});
            const b = new TestNode({row: {
                obj: {a: 1, b: 2, c: 3}
            }});

            assert.strictEqual( a.equal(b), true );
        });

        it("compare objects with different keys", () => {
            const a = new TestNode({row: {
                obj: {a: 1, b: 2}
            }});
            const b = new TestNode({row: {
                obj: {a: 1, b: 2, c: 3}
            }});

            assert.strictEqual( a.equal(b), false );
        });

        it("compare child node and primitive", () => {
            const a = new TestNode({row: {
                child: new TestNode({row: {}})
            }});
            const b = new TestNode({row: {
                child: 100
            }});

            assert.strictEqual( a.equal(b), false );
        });

        it("compare primitive combinations", () => {
            const combinations: [any, any, boolean][] = [
                [Number.NaN, Number.NaN, true],
                [null, null, true],
                [undefined, undefined, true],
                [new Date(), new Date(), true],
                ["", "", true],
                [0, 0, true],

                [Number.NaN, {}, false],
                [Number.NaN, [], false],
                [null, {}, false],
                [null, [], false],
                [undefined, {}, false],
                [undefined, [], false],
                [new Date(), 0, false],

                [null, undefined, false],
                [false, null, false],
                [false, 0, false],
                ["", 0, false],
                ["", null, false],
                ["", undefined, false]
            ];

            for (const combination of combinations) {
                const aValue = combination[0];
                const bValue = combination[1];
                const expectedResult = combination[2];

                const aNode = new TestNode({row: {
                    value: aValue
                }});
                const bNode = new TestNode({row: {
                    value: bValue
                }});

                assert.strictEqual(
                    aNode.equal(bNode),
                    combination[2],
                    `${aValue} === ${bValue} => ${expectedResult}`
                );
            }
        });

    });

});