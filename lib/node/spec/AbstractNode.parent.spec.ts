/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createClass } from "./util";
import assert from "assert";

describe("AbstractNode.parent.spec.ts", () => {

    describe("node.parent", () => {

        it("node.row contains primitive values and nodes", () => {

            const TestNode = createClass<{
                a?: Date;
                b?: number;
                c?: any;
            }>();

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
            const TestNode = createClass<{
                children: any[];
            }>();

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
            const TestNode = createClass<{
                matrix: any[][];
            }>();

            const child = new TestNode({row: {
                matrix: []
            }});
            const parent = new TestNode({row: {
                matrix: [[child]]
            }});

            assert.ok( child.parent === parent );
        });

        it("node.row contains dictionary of nodes", () => {
            const TestNode = createClass<{
                dictionary: {
                    [key: string]: any;
                };
            }>();

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
            const TestNode = createClass<{
                dictionary: {
                    [key: string]: {
                        [key: string]: any;
                    };
                };
            }>();

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
            const TestNode = createClass<{
                value: any;
            }>();

            const a: any = {};
            const b: any = {a};
            const c: any = {b, arr: [a, b]};
            a.c = c;

            new TestNode({row: {value: c}});
            assert.ok(true, "no errors");
        });
    });

});