import {
    AbstractNode,
    TemplateElement, eol,
    printTabChain
} from "../index";
import assert from "assert";

describe("printTabChain(nodes, ...delimiter[])", () => {

    it("stringify without delimiter", () => {
        class Child extends AbstractNode<{when: string; then: string}> {
            template(): TemplateElement[] {
                return [
                    "when ", this.row.when, eol,
                    "then ", this.row.then
                ];
            }
        }

        class Parent extends AbstractNode<{elements: Child[]}> {
            template(): TemplateElement[] {
                return [
                    "case", eol,
                    ...printTabChain(this.row.elements), eol,
                    "end"
                ];
            }
        }

        const elements = [
            new Child({row: {when: "false", then: "1"}})
        ];
        const parent = new Parent({row: {
            elements
        }});

        const actual = parent.toString();
        const expected = [
            "case",
            "    when false",
            "    then 1",
            "end"
        ].join("\n");
        assert.strictEqual(actual, expected);
    });

    it("stringify with delimiter", () => {
        class FromItem extends AbstractNode<{joins: string[]}> {
            template(): TemplateElement[] {
                return [
                    "from table", eol,
                    ...printTabChain(
                        this.row.joins, eol
                    )
                ];
            }
        }

        const from = new FromItem({row: {joins: [
            "join x",
            "join y"
        ]}});

        const actual = from.toString();
        const expected = [
            "from table",
            "    join x",
            "    join y"
        ].join("\n");
        assert.strictEqual(actual, expected);
    });

    it("printChain(undefined)", () => {
        const result = printTabChain(undefined, ".");
        assert.deepStrictEqual(result, []);
    });

});
