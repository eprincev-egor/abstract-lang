/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AbstractNode } from "../AbstractNode";
import { eol, tab, _ } from "../stringifyNode";
import assert from "assert";

describe("AbstractNode", () => {


    describe("toString()", () => {

        const node = Object.create(AbstractNode.prototype) as AbstractNode<any>;
        node.template = () => [
            "case", eol,
            "when true", eol,
            "then", eol,
            tab, "1", _, "+", _, "2", eol,
            "else", eol,
            tab, "2", eol,
            "end"
        ];

        it("using default: eol, tab, _", () => {
            const actualString = node.toString();
            assert.strictEqual(
                actualString,
                [
                    "case",
                    "when true",
                    "then",
                    "    1 + 2",
                    "else",
                    "    2",
                    "end"
                ].join("\n")
            );
        });

        it("using custom: eol, tab, _", () => {
            const actualString = node.toString({
                _: "",
                eol: "\r",
                tab: "  "
            });

            assert.strictEqual(
                actualString,
                [
                    "case",
                    "when true",
                    "then",
                    "  1+2",
                    "else",
                    "  2",
                    "end"
                ].join("\r")
            );
        });

    });

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

    describe("node.findParentInstance(SomeNode)", () => {
        const TestNode = createClass<{child?: any}>();

        it("no parent", () => {
            const node = new TestNode({row: {}});
            const result = node.findParentInstance(TestNode);
            assert.strictEqual(result, undefined);
        });

        it("one parent", () => {
            const child = new TestNode({row: {}});
            const parent = new TestNode({row: {
                child
            }});

            const result = child.findParentInstance(TestNode);
            assert.ok(result === parent);
        });

        it("find concrete parent", () => {
            const SelectNode = createClass<{child?: any}>();
            const ExpressionNode = createClass<{child?: any}>();

            const childExpression = new ExpressionNode({row: {}});
            const parentExpression = new ExpressionNode({row: {
                child: childExpression
            }});
            const select = new SelectNode({row: {
                child: parentExpression
            }});

            assert.ok(
                childExpression.findParentInstance(SelectNode) === select,
                "find SelectNode"
            );
            assert.ok(
                childExpression.findParentInstance(ExpressionNode) === parentExpression,
                "find ExpressionNode"
            );
        });

    });

    describe("node.filterChildrenByInstance(SomeNode)", () => {
        const TestNode = createClass<{child?: any}>();

        it("no children", () => {
            const node = new TestNode({row: {}});
            const result = node.filterChildrenByInstance(TestNode);
            assert.deepStrictEqual(result, []);
        });

        it("one child", () => {
            const child = new TestNode({row: {}});
            const parent = new TestNode({row: {
                child
            }});

            const result = parent.filterChildrenByInstance(TestNode);
            assert.strictEqual(result.length, 1);
            assert.ok(result[0] === child);
        });

        it("many children", () => {
            const child1 = new TestNode({row: {}});
            const child2 = new TestNode({row: {
                child: child1
            }});

            const parent = new TestNode({row: {
                child: child2
            }});

            const result = parent.filterChildrenByInstance(TestNode);
            assert.strictEqual(result.length, 2);
            assert.ok(result[0] === child2);
            assert.ok(result[1] === child1);
        });

        it("filter correct instances", () => {
            const SelectNode = createClass<{child?: any}>();
            const ExpressionNode = createClass<{child?: any}>();

            const expression1 = new ExpressionNode({row: {}});
            const expression2 = new ExpressionNode({row: {
                child: expression1
            }});
            const childSelect1 = new SelectNode({row: {
                child: expression2
            }});
            const childSelect2 = new SelectNode({row: {
                child: childSelect1
            }});

            const parentSelect = new SelectNode({row: {
                child: childSelect2
            }});

            const result = parentSelect.filterChildrenByInstance(ExpressionNode);
            assert.strictEqual(result.length, 2);
            assert.ok(result[0] === expression2, "expression2");
            assert.ok(result[1] === expression1, "expression1");
        });
    });

});

function createClass<T>() {
    return class TestNode extends AbstractNode<T> {
        // eslint-disable-next-line class-methods-use-this
        template() {
            return [];
        }
    };
}