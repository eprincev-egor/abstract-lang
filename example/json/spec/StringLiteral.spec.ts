import { BaseParser } from "abstract-lang";
import { StringLiteral } from "../index";

describe("StringLiteral", () => {

    it("valid inputs", () => {
        BaseParser.assertNode(StringLiteral, {
            input: "\"hello\"",
            shouldBe: {
                json: {string: "hello"}
            }
        });

        BaseParser.assertNode(StringLiteral, {
            input: "\"\"",
            shouldBe: {
                json: {string: ""}
            }
        });

        BaseParser.assertNode(StringLiteral, {
            input: "\"he\\\\llo\"",
            shouldBe: {
                json: {string: "he\\llo"}
            }
        });
    });

});