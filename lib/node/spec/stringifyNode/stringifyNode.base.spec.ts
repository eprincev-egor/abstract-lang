import { AbstractNode } from "../../AbstractNode";
import { eol, _, tab } from "../../util";
import { testStringifyNode } from "./util";

describe("stringifyNode(node, spaces?) base.spec.ts", () => {

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

    it("serialize empty child", () => {
        const child = Object.create(AbstractNode.prototype) as AbstractNode<any>;
        child.template = () => [];

        testStringifyNode({
            template: () => [
                tab, child, eol
            ],
            expectedString: "\n"
        });
    });

    it("serialize [child] as just child without indent", () => {
        const child = Object.create(AbstractNode.prototype) as AbstractNode<any>;
        child.template = () => ["hello", eol, "world"];

        testStringifyNode({
            template: () => [child],
            expectedString: "hello\nworld"
        });
    });

    it("up indent by two tabs", () => {

        class SomeNode extends AbstractNode<{child: SomeNode | string}> {
            template() {
                return [
                    "if true then", eol,
                    tab, tab, this.row.child, eol,
                    "end if;"
                ];
            }
        }

        const level2 = new SomeNode({
            row: {
                child: "level 2"
            }
        });
        const level1 = new SomeNode({
            row: {
                child: level2
            }
        });

        testStringifyNode({
            template: level1.template.bind(level1),
            expectedString: [
                "if true then",
                "        if true then",
                "                level 2",
                "        end if;",
                "end if;"
            ].join("\n")
        });
    });

    it("don't up child if not tab before", () => {
        const child = Object.create(AbstractNode.prototype) as AbstractNode<any>;
        child.template = () => ["hello", eol, "world"];

        testStringifyNode({
            template: () => [
                "(", eol,
                child, eol,
                ")"
            ],
            expectedString: "(\nhello\nworld\n)"
        });
    });

});