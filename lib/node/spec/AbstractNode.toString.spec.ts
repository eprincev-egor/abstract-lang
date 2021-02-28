import { AbstractNode } from "../AbstractNode";
import { eol, tab, _ } from "../util";
import assert from "assert";

describe("AbstractNode.toString.spec.ts", () => {

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

});
