import { AbstractNode, eol, _, tab } from "../AbstractNode";
import assert from "assert";

describe("AbstractNode", () => {


    describe("toString()", () => {

        interface TestToString {
            template: () =>
                ReturnType<AbstractNode<any>["template"]>;
            expectedString: string;
        }
        function testToString(test: TestToString) {
            const node = Object.create(AbstractNode.prototype) as AbstractNode<any>;
            node.template = test.template;

            const actualString = node.toString();
            assert.strictEqual(
                actualString,
                test.expectedString
            );
        }

        it("serialize simple string", () => {
            testToString({
                template: () => "test",
                expectedString: "test"
            });
        });

        it("using spaces._", () => {
            testToString({
                template: () => ["hello", _, "world"],
                expectedString: "hello world"
            });
        });

        it("using spaces.eol", () => {
            testToString({
                template: () => ["select", eol, "1"],
                expectedString: "select\n1"
            });
        });

        it("using spaces.tab", () => {
            testToString({
                template: () => ["select", eol, tab, "1"],
                expectedString: "select\n    1"
            });
        });

        it("serialize child element", () => {
            const child = Object.create(AbstractNode.prototype) as AbstractNode<any>;
            child.template = () => "child";

            testToString({
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
                },
                position: {start: 0, end: 0}
            });
            const level2 = new IfStatement({
                row: {
                    condition: "level2",
                    body: level3
                },
                position: {start: 0, end: 0}
            });
            const level1 = new IfStatement({
                row: {
                    condition: "level1",
                    body: level2
                },
                position: {start: 0, end: 0}
            });

            testToString({
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

            testToString({
                template: () => [
                    "if false then", eol,
                    tab, child, eol,
                    "end if;"
                ],
                expectedString: "if false then\n\n\n\nend if;"
            });
        });

    });

});