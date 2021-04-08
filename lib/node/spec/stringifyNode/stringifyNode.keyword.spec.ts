import { AbstractNode } from "../../AbstractNode";
import {
    eol, _, tab, keyword,
    printChain
} from "../../util";
import { testStringifyKeywordNode } from "./util";


describe("stringifyNode(node, spaces?) keyword.spec.ts", () => {

    it("nothing between two keywords", () => {
        testStringifyKeywordNode({
            template: [
                keyword("case"),
                keyword("when")
            ],
            expectedPretty: "case when",
            expectedMinify: "case when"
        });
    });

    it("one not required space between two keywords", () => {
        testStringifyKeywordNode({
            template: [
                keyword("case"),
                _,
                keyword("when")
            ],
            expectedPretty: "case when",
            expectedMinify: "case when"
        });
    });

    it("tab between two keywords", () => {
        testStringifyKeywordNode({
            template: [
                keyword("case"),
                tab,
                keyword("when")
            ],
            expectedPretty: "case    when",
            expectedMinify: "case when"
        });
    });

    it("eol between two keywords", () => {
        testStringifyKeywordNode({
            template: [
                keyword("case"),
                eol,
                keyword("when")
            ],
            expectedPretty: "case\nwhen",
            expectedMinify: "case when"
        });
    });

    it("string with alphabet after keyword", () => {
        testStringifyKeywordNode({
            template: [
                keyword("when"),
                "company.name is not null"
            ],
            expectedPretty: "when company.name is not null",
            expectedMinify: "when company.name is not null"
        });
    });

    it("string with alphabet before keyword", () => {
        testStringifyKeywordNode({
            template: [
                "company.name",
                keyword("else")
            ],
            expectedPretty: "company.name else",
            expectedMinify: "company.name else"
        });
    });

    it("string with digits after keyword", () => {
        testStringifyKeywordNode({
            template: [
                keyword("then"),
                "1"
            ],
            expectedPretty: "then 1",
            expectedMinify: "then 1"
        });
    });

    it("empty string between two keywords", () => {
        testStringifyKeywordNode({
            template: [
                keyword("case"),
                "",
                keyword("when")
            ],
            expectedPretty: "case when",
            expectedMinify: "case when"
        });
    });

    it("many not required spaces between two keywords", () => {
        testStringifyKeywordNode({
            template: [
                keyword("case"),
                _, _, _,
                keyword("when")
            ],
            expectedPretty: "case   when",
            expectedMinify: "case when"
        });
    });

    it("full case when example", () => {
        const caseNode = Object.create(AbstractNode.prototype) as AbstractNode<any>;
        caseNode.template = () => [
            keyword("when"), "true", eol,
            keyword("then"), "1"
        ];

        testStringifyKeywordNode({
            template: [
                keyword("case"),
                ...printChain([caseNode], eol), eol,
                tab, keyword("else"), _, "'(unknown)'", eol,
                keyword("end")
            ],
            expectedPretty: [
                "case when true",
                "    then 1",
                "    else '(unknown)'",
                "end"
            ].join("\n"),
            expectedMinify: "case when true then 1 else '(unknown)' end"
        });
    });

    it("mixin tab/_/eol between two keywords", () => {
        testStringifyKeywordNode({
            template: [
                keyword("case"),
                tab, eol, _, eol, tab,
                keyword("when")
            ],
            expectedPretty: "case    \n\n    when",
            expectedMinify: "case when"
        });
    });

});