/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
    TestNode,
    infinityRecursion, empty,
    primitive,
    oneChild
} from "./fixture";
import assert from "assert";

describe("AbstractNode.clone.spec.ts", () => {

    describe("node.clone()", () => {

        it("check instance", () => {
            const clone = empty.clone();

            assert.ok( clone instanceof TestNode, "correct instance" );
            assert.ok( clone !== empty, "returned new object" );
        });

        it("should have same row object", () => {
            const clone = primitive.clone();

            assert.ok( clone.row !== primitive.row, "clone.row is new object" );
            assert.deepStrictEqual(clone.row, primitive.row);
        });

        it("changed clone cannot have position", () => {
            const original = new TestNode({
                row: {value: "original"},
                position: {
                    start: 0,
                    end: 8
                }
            });
            const clone = original.clone({
                value: "clone"
            });

            assert.strictEqual(
                clone.position, undefined
            );
        });

        it("node.row with infinity recursion", () => {
            const clone = infinityRecursion.clone();

            assert.ok( clone.row.c.a, "has c.a" );
            assert.ok( clone.row.c.a.b, "has c.a.b" );
            assert.ok( clone.row.c.a.b.c, "has c.a.b.c" );
            assert.ok( clone.row.c.a.b.c.arr[0], "has c.a.b.c.arr[0]" );
            assert.ok( clone.row.c.a.b.c.arr[1], "has c.a.b.c.arr[1]" );
        });

        it("correct clone child Node", () => {
            const clone = oneChild.parent.clone();

            assert.ok( clone.row.child instanceof TestNode, "correct instance" );
            assert.ok( clone.row.child !== oneChild.child, "child is new object" );
            assert.ok( clone.row.child.parent === clone, "correct new child.parent" );
        });

        it("correct clone position", () => {
            const node = new TestNode({
                row: {},
                position: {start: 100, end: 200}
            });
            const clone = node.clone();

            assert.deepStrictEqual(clone.position, {
                start: 100,
                end: 200
            });

            assert.ok( clone.position !== node.position, "clone.position is new object" );
        });

        it("clone with changes", () => {
            const node = new TestNode({row: {
                a: 1,
                b: 2
            }});
            const clone = node.clone({
                a: 10
            });

            assert.deepStrictEqual(clone.row, {
                a: 10,
                b: 2
            });
        });

        it("clone with changes, check new child.parent", () => {
            const child = new TestNode({row: {}});
            const parent = new TestNode({row: {child}});

            const clone = parent.clone({
                child
            });

            assert.ok( clone.row.child !== child, "child is new object!" );
            assert.ok( clone.row.child.parent === clone, "correct new child.parent" );
        });

    });

});
