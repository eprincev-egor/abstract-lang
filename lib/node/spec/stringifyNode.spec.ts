import { AbstractNode } from "../AbstractNode";
import { eol, _, tab, stringifyNode } from "../stringifyNode";
import assert from "assert";

interface TestToString {
    template: () =>
        ReturnType<AbstractNode<any>["template"]>;
    expectedString: string;
}

function testStringifyNode(test: TestToString) {
    const node = Object.create(AbstractNode.prototype) as AbstractNode<any>;
    node.template = test.template;

    const actualString = stringifyNode(node);
    assert.strictEqual(
        actualString,
        test.expectedString
    );
}

describe("stringifyNode(node, spaces?)", () => {

    it("serialize simple string", () => {
        testStringifyNode({
            template: () => "test",
            expectedString: "test"
        });
    });

    it("using spaces._", () => {
        testStringifyNode({
            template: () => ["hello", _, "world"],
            expectedString: "hello world"
        });
    });

    it("using spaces.eol", () => {
        testStringifyNode({
            template: () => ["select", eol, "1"],
            expectedString: "select\n1"
        });
    });

    it("using spaces.tab", () => {
        testStringifyNode({
            template: () => ["select", eol, tab, "1"],
            expectedString: "select\n    1"
        });
    });

    it("serialize child element", () => {
        const child = Object.create(AbstractNode.prototype) as AbstractNode<any>;
        child.template = () => "child";

        testStringifyNode({
            template: () => [
                "if true then", eol,
                tab, child, eol,
                "end if;"
            ],
            expectedString: "if true then\n    child\nend if;"
        });
    });

    it("up indent", () => {

        interface IfStatementRow {
            condition: string;
            body: IfStatement | string;
        }

        class IfStatement extends AbstractNode<IfStatementRow> {
            template() {
                const {condition, body} = this.row;

                return [
                    "if ", condition, " then", eol,
                    tab, body, eol,
                    "end if;"
                ];
            }
        }

        const level3 = new IfStatement({
            row: {
                condition: "level3",
                body: "level3;"
            }
        });
        const level2 = new IfStatement({
            row: {
                condition: "level2",
                body: level3
            }
        });
        const level1 = new IfStatement({
            row: {
                condition: "level1",
                body: level2
            }
        });

        testStringifyNode({
            template: level1.template.bind(level1),
            expectedString: [
                "if level1 then",
                "    if level2 then",
                "        if level3 then",
                "            level3;",
                "        end if;",
                "    end if;",
                "end if;"
            ].join("\n")
        });
    });

    it("serialize blank lines as empty string", () => {
        const child = Object.create(AbstractNode.prototype) as AbstractNode<any>;
        child.template = () => [eol, eol];

        testStringifyNode({
            template: () => [
                "if false then", eol,
                tab, child, eol,
                "end if;"
            ],
            expectedString: "if false then\n\n\n\nend if;"
        });
    });

});