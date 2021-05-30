import { BaseParser } from "abstract-lang";
import { NullLiteral } from "../index";

describe("NullLiteral", () => {

    it("valid inputs", () => {
        BaseParser.assertNode(NullLiteral, {
            input: "null",
            shouldBe: {
                json: {null: true}
            }
        });
    });

});