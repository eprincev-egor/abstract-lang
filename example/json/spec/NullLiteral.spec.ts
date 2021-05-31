import { JsonLang } from "../JsonLang";
import { NullLiteral } from "../index";

describe("NullLiteral", () => {

    it("valid inputs", () => {
        JsonLang.assertNode(NullLiteral, {
            input: "null",
            shouldBe: {
                json: {null: true}
            }
        });
    });

});