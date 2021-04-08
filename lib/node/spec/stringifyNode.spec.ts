/* eslint-disable unicorn/consistent-function-scoping */
import { AbstractNode } from "../AbstractNode";
import {
    stringifyNode,
    eol, _, tab, keyword,
    Spaces, PrettySpaces, MinifySpaces,
    printChain
} from "../util";
import assert from "assert";

interface TestToString {
    template: () =>
        ReturnType<AbstractNode<any>["template"]>;
    expectedString: string;
}

function testStringifyNode(
    test: TestToString,
    spaces: Spaces = PrettySpaces
) {
    const node = Object.create(AbstractNode.prototype) as AbstractNode<any>;
    node.template = test.template;

    const actualString = stringifyNode(node, spaces);
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

    describe("keyword", () => {

        const caseWhen = {
            template: () => [
                keyword("case"),
                keyword("when")
            ],
            expectedString: "case when"
        };
        const case_when = {
            template: () => [
                keyword("case"),
                _,
                keyword("when")
            ],
            expectedString: "case when"
        };
        const whenAlphabet = {
            template: () => [
                keyword("when"),
                "company.name is not null"
            ],
            expectedString: "when company.name is not null"
        };

        describe("pretty", () => {

            it("add spaces between two keywords", () => {
                testStringifyNode(caseWhen, PrettySpaces);
            });

            it("not required space between two keywords", () => {
                testStringifyNode(case_when, PrettySpaces);
            });

            it("tab between two keywords", () => {
                testStringifyNode({
                    template: () => [
                        keyword("case"),
                        tab,
                        keyword("when")
                    ],
                    expectedString: "case    when"
                }, PrettySpaces);
            });

            it("eol between two keywords", () => {
                testStringifyNode({
                    template: () => [
                        keyword("case"),
                        eol,
                        keyword("when")
                    ],
                    expectedString: "case\nwhen"
                }, PrettySpaces);
            });

            it("string with alphabet after keyword", () => {
                testStringifyNode(whenAlphabet, PrettySpaces);
            });

            it("full case when example", () => {
                const caseNode = Object.create(AbstractNode.prototype) as AbstractNode<any>;
                caseNode.template = () => [
                    keyword("when"), "true", eol,
                    keyword("then"), "1"
                ];

                testStringifyNode({
                    template: () => [
                        keyword("case"),
                        ...printChain([caseNode], eol), eol,
                        keyword("else"), _, "'(unknown)'", eol,
                        keyword("end")
                    ],
                    expectedString: [
                        "case",
                        "    when true",
                        "    then 1",
                        "    else '(unknown)'",
                        "end"
                    ].join("\n")
                }, PrettySpaces);
            });

        });

        describe("minify", () => {

            it("add spaces between two keywords", () => {
                testStringifyNode(caseWhen, MinifySpaces);
            });

            it("not required space between two keywords", () => {
                testStringifyNode(case_when, MinifySpaces);
            });

            it("many not required spaces between two keywords", () => {
                testStringifyNode({
                    template: () => [
                        keyword("case"),
                        _, _, _,
                        keyword("when")
                    ],
                    expectedString: "case when"
                }, MinifySpaces);
            });

            it("tab between two keywords", () => {
                testStringifyNode({
                    template: () => [
                        keyword("case"),
                        tab, _, tab,
                        keyword("when")
                    ],
                    expectedString: "case when"
                }, MinifySpaces);
            });

            it("eol between two keywords", () => {
                testStringifyNode({
                    template: () => [
                        keyword("case"),
                        eol,
                        keyword("when")
                    ],
                    expectedString: "case when"
                }, MinifySpaces);
            });

            it("empty string between two keywords", () => {
                testStringifyNode({
                    template: () => [
                        keyword("case"),
                        "",
                        keyword("when")
                    ],
                    expectedString: "case when"
                }, MinifySpaces);
            });

            it("string with alphabet after keyword", () => {
                testStringifyNode(whenAlphabet, MinifySpaces);
            });

        });

    });

});