import { BaseParser } from "abstract-lang";
import { BooleanLiteral } from "../index";

describe("BooleanLiteral", () => {

    it("valid inputs", () => {
        BaseParser.assertNode(BooleanLiteral, {
            input: "true",
            shouldBe: {
                json: {boolean: true}
            }
        });

        BaseParser.assertNode(BooleanLiteral, {
            input: "false",
            shouldBe: {
                json: {boolean: false}
            }
        });
    });

});