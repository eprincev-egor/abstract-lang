/* eslint-disable unicorn/filename-case */
import { TestNode, primitive, testDate, infinityRecursion } from "./fixture";
import assert from "assert";

describe("AbstractNode.toJSON.spec.ts", () => {

    describe("node.toJSON()", () => {

        it("test simple data", () => {
            assert.deepStrictEqual(primitive.toJSON(), {
                boolTrue: true,
                boolFalse: false,
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
            assert.throws(() => {
                infinityRecursion.toJSON();
            }, (err: Error) =>
                err.message === "Cannot converting circular structure to JSON"
            );
        });

    });

});
