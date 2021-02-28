/* eslint-disable unicorn/filename-case */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createClass } from "./util";
import assert from "assert";

describe("AbstractNode.toJSON.spec.ts", () => {

    describe("node.toJSON()", () => {
        const TestNode = createClass<any>();

        it("test simple data", () => {
            const testDate = new Date();
            const node = new TestNode({row: {
                numb: 1,
                str: "hello",
                date: testDate,
                arr: [{hello: "world"}],
                obj: {hello: [{str: "world"}]}
            }});

            const json = node.toJSON();
            assert.deepStrictEqual(json, {
                numb: 1,
                str: "hello",
                date: testDate.toISOString(),
                arr: [{hello: "world"}],
                obj: {hello: [{str: "world"}]}
            });
        });

        it("child models to json", () => {
            const child1 = new TestNode({
                row: {name: "child1"}
            });
            const child2 = new TestNode({
                row: {name: "child2"}
            });
            const child3 = new TestNode({
                row: {name: "child3"}
            });
            const node = new TestNode({row: {
                a: child1,
                b: [child2],
                c: {x: child3}
            }});

            const json = node.toJSON();
            assert.deepStrictEqual(json, {
                a: {name: "child1"},
                b: [{name: "child2"}],
                c: {x: {name: "child3"}}
            });
        });

        it("infinity recursion", () => {
            const a: any = {};
            const b: any = {a, arr: [a]};
            const c: any = {a, b, arr: [a, b]};
            a.c = c;
            a.b = b;
            b.c = c;

            const node = new TestNode({row: {
                c
            }});

            assert.throws(() => {
                node.toJSON();
            }, (err: Error) =>
                err.message === "Cannot converting circular structure to JSON"
            );
        });

    });

});
