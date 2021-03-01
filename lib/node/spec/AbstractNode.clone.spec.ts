/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createClass } from "./util";
import assert from "assert";

describe("AbstractNode.clone.spec.ts", () => {

    describe("node.clone()", () => {

        it("check instance", () => {
            const TestNode = createClass();
            const node = new TestNode({row: {}});
            const clone = node.clone();

            assert.ok( clone instanceof TestNode, "correct instance" );
            assert.ok( clone !== node, "returned new object" );
        });

        it("should have same row object", () => {
            const TestNode = createClass<{
                boolTrue: boolean;
                boolFalse: boolean;
                numb: number;
                str: string;
                date: Date;
                arr: any[];
                obj: {[key: string]: any};
            }>();
            const testDate = new Date();
            const node = new TestNode({row: {
                boolTrue: true,
                boolFalse: false,
                numb: 1,
                str: "hello",
                date: testDate,
                arr: [{hello: "world"}],
                obj: {hello: [{str: "world"}]}
            }});
            const clone = node.clone();

            assert.ok( clone.row !== node.row, "clone.row is new object" );
            assert.deepStrictEqual(clone.row, {
                boolTrue: true,
                boolFalse: false,
                numb: 1,
                str: "hello",
                date: testDate,
                arr: [{hello: "world"}],
                obj: {hello: [{str: "world"}]}
            });
        });

        it("node.row with infinity recursion", () => {
            const TestNode = createClass<{value: any}>();

            const a: any = {};
            const b: any = {a, arr: [a]};
            const c: any = {a, b, arr: [a, b]};
            a.c = c;
            a.b = b;
            b.c = c;

            const node = new TestNode({
                row: {
                    value: c
                }
            });
            const clone = node.clone();

            assert.ok( clone.row.value.a, "has a" );
            assert.ok( clone.row.value.a.b, "has a.b" );
            assert.ok( clone.row.value.a.b.c, "has a.b.c" );
            assert.ok( clone.row.value.a.b.c.arr[0], "has a.b.c.arr[0]" );
            assert.ok( clone.row.value.a.b.c.arr[1], "has a.b.c.arr[1]" );
        });

        it("correct clone child Node", () => {
            const TestNode = createClass<{child?: any}>();
            const child = new TestNode({row: {}});
            const parent = new TestNode({row: {child}});

            const clone = parent.clone();

            assert.ok( clone.row.child instanceof TestNode, "correct instance" );
            assert.ok( clone.row.child !== child, "child is new object" );
            assert.ok( clone.row.child.parent === clone, "correct new child.parent" );
        });

        it("correct clone position", () => {
            const TestNode = createClass();
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
            const TestNode = createClass<any>();
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
            const TestNode = createClass<{child?: any}>();
            const child = new TestNode({row: {}});
            const parent = new TestNode({row: {}});

            const clone = parent.clone({
                child
            });

            assert.ok( clone.row.child !== child, "child is new object!" );
            assert.ok( clone.row.child.parent === clone, "correct new child.parent" );
        });

    });

});
