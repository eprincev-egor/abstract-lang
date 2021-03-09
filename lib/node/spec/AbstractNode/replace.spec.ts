/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
    TestNode,
    HumanNode, humans,
    infinityRecursion
} from "./fixture";
import assert from "assert";

describe("AbstractNode/replace.spec.ts", () => {

    describe("node.replace(cb)", () => {

        it("replace one child", () => {
            const result = humans.root.replace((node) => {
                if ( node.is(HumanNode) && node.row.name === "bob" ) {
                    return node.clone({
                        name: "replaced bob"
                    });
                }
            });

            assert.ok( result instanceof HumanNode );
            assert.deepStrictEqual( result.toJSON(), {
                name: "oliver",
                child: {
                    name: "jane",
                    child: {
                        name: "jack",
                        child: {
                            name: "replaced bob"
                        }
                    }
                }
            });

            const children = result.filterChildren(() => true);
            for (const child of children) {
                assert.strictEqual(
                    child.position, undefined,
                    `${(child as any).row.name}: replaced nodes cannot have positions`
                );
            }

            for (let i = 1, n = children.length; i < n; i++) {
                const child = children[i];
                const parent = children[i - 1];

                assert.ok(
                    child.parent === parent,
                    `child "${(child as any).row.name}" should have parent "${(parent as any).row.name}"`
                );
            }
        });

        it("replace inside array", () => {
            const child1 = new HumanNode(() => ({row: {name: "child1"}}));
            const child2 = new HumanNode(() => ({row: {name: "child2"}}));

            const parent = new TestNode(() => ({
                row: {
                    arr: [child1, child2]
                }
            }));

            const result = parent.replace((child) => {
                if ( child.is(HumanNode) && child.row.name === "child1" ) {
                    return child.clone({
                        name: "replaced"
                    });
                }
            });

            assert.deepStrictEqual(result.toJSON(), {
                arr: [
                    {name: "replaced"},
                    {name: "child2"}
                ]
            });
        });

        it("replace inside dictionary", () => {
            const child1 = new HumanNode(() => ({row: {name: "item1"}}));
            const child2 = new HumanNode(() => ({row: {name: "item2"}}));

            const parent = new TestNode(() => ({
                row: {
                    dictionary: {
                        a: child1,
                        b: child2
                    }
                }
            }));

            const result = parent.replace((child) => {
                if ( child.is(HumanNode) && child.row.name === "item2" ) {
                    return child.clone({
                        name: "replaced"
                    });
                }
            });

            assert.deepStrictEqual(result.toJSON(), {
                dictionary: {
                    a: {name: "item1"},
                    b: {name: "replaced"}
                }
            });
        });

        it("replacer returns original node, need clone", () => {
            const result = humans.root.replace((node) => node);
            assert.ok(result.row.child !== humans.root.row.child);
        });

        it("infinity recursion", () => {
            const result = infinityRecursion.replace(voidFunction);
            assert.ok(result !== infinityRecursion);
        });

    });

});

function voidFunction(): void {
    return;
}