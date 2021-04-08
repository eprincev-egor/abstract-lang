import { AbstractNode } from "../../AbstractNode";
import {
    stringifyNode,
    eol, _, tab, keyword,
    Spaces, PrettySpaces, MinifySpaces,
    printChain
} from "../../util";
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

describe("stringifyNode(node, spaces?) keyword.spec.ts", () => {

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
    const alphabetElse = {
        template: () => [
            "company.name",
            keyword("else")
        ],
        expectedString: "company.name else"
    };
    const thenDigits = {
        template: () => [
            keyword("then"),
            "1"
        ],
        expectedString: "then 1"
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

        it("string with digits after keyword", () => {
            testStringifyNode(thenDigits, PrettySpaces);
        });

        it("string with alphabet before keyword", () => {
            testStringifyNode(alphabetElse, PrettySpaces);
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
                    tab, keyword("else"), _, "'(unknown)'", eol,
                    keyword("end")
                ],
                expectedString: [
                    "case when true",
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

        it("string with digits after keyword", () => {
            testStringifyNode(thenDigits, PrettySpaces);
        });

        it("string with alphabet before keyword", () => {
            testStringifyNode(alphabetElse, PrettySpaces);
        });

    });

});