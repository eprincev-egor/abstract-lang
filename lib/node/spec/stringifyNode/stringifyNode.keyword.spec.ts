import { AbstractNode } from "../../AbstractNode";
import {
    eol, _, tab, keyword,
    printTabChain
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
                keyword("case"), eol,
                ...printTabChain([caseNode], eol), eol,
                tab, keyword("else"), _, "'(unknown)'", eol,
                keyword("end")
            ],
            expectedPretty: [
                "case",
                "    when true",
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

    it("danger symbols", () => {
        const dangerChars = (
            "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM" +
            "0123456789" +
            "$_\"'`"
        ).split("");

        for (const dangerChar of dangerChars) {
            const shouldBe = `${dangerChar} case ${dangerChar} when ${dangerChar}`;
            testStringifyKeywordNode({
                template: [
                    dangerChar,
                    keyword("case"),
                    dangerChar,
                    keyword("when"),
                    dangerChar
                ],
                expectedPretty: shouldBe,
                expectedMinify: shouldBe
            });
        }
    });

    it("safety symbols", () => {
        const safetyChars = (
            "()[]{}" +
            "*/-+%&|=?:;"
        ).split("");

        for (const safetyChar of safetyChars) {
            const shouldBe = `${safetyChar}case${safetyChar}when${safetyChar}`;
            testStringifyKeywordNode({
                template: [
                    safetyChar,
                    keyword("case"),
                    safetyChar,
                    keyword("when"),
                    safetyChar
                ],
                expectedPretty: shouldBe,
                expectedMinify: shouldBe
            });
        }
    });
});