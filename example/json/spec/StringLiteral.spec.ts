import { JsonLang } from "../JsonLang";
import { StringLiteral } from "../index";

describe("StringLiteral", () => {

    it("valid inputs", () => {
        JsonLang.assertNode(StringLiteral, {
            input: "\"hello\"",
            shouldBe: {
                json: {string: "hello"}
            }
        });

        JsonLang.assertNode(StringLiteral, {
            input: "\"\"",
            shouldBe: {
                json: {string: ""}
            }
        });

        JsonLang.assertNode(StringLiteral, {
            input: "\"he\\\\llo\"",
            shouldBe: {
                json: {string: "he\\llo"}
            }
        });
    });

});