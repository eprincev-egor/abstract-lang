import {
    AbstractNode,
    TemplateElement, _, printChain
} from "../index";
import assert from "assert";

describe("printChain(nodes, ...delimiter[])", () => {

    it("stringify without delimiter", () => {
        class Child extends AbstractNode<{when: string; then: string}> {
            template(): TemplateElement[] {
                return [
                    "when ", this.row.when,
                    " then ", this.row.then
                ];
            }
        }

        class Parent extends AbstractNode<{elements: Child[]}> {
            template(): TemplateElement[] {
                return [
                    "case ",
                    ...printChain(this.row.elements),
                    " end"
                ];
            }
        }

        const elements = [
            new Child({row: {when: "false", then: "1"}}),
            new Child({row: {when: "true", then: "2"}})
        ];
        const parent = new Parent({row: {elements}});

        const actual = parent.toString();
        const expected = "case when false then 1 when true then 2 end";
        assert.strictEqual(actual, expected);
    });

    it("stringify with delimiter", () => {
        class ArrayLiteral extends AbstractNode<{elements: string[]}> {
            template(): TemplateElement[] {
                return [
                    "ARRAY[",
                    ...printChain(
                        this.row.elements,
                        ",", _
                    ),
                    "]"
                ];
            }
        }

        const array = new ArrayLiteral({row: {elements: [
            "1", "2", "3"
        ]}});

        const actual = array.toString();
        const expected = "ARRAY[1, 2, 3]";
        assert.strictEqual(actual, expected);
    });

});
