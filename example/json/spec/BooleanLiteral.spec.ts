import { JsonLang } from "../JsonLang";
import { BooleanLiteral } from "../index";

describe("BooleanLiteral", () => {

    it("valid inputs", () => {
        JsonLang.assertNode(BooleanLiteral, {
            input: "true",
            shouldBe: {
                json: {boolean: true}
            }
        });

        JsonLang.assertNode(BooleanLiteral, {
            input: "false",
            shouldBe: {
                json: {boolean: false}
            }
        });
    });

});