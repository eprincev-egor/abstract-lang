import { assertNode } from "abstract-lang";
import { BooleanLiteral } from "../index";

describe("BooleanLiteral", () => {

    it("valid inputs", () => {
        assertNode(BooleanLiteral, {
            input: "true",
            shouldBe: {
                json: {boolean: true}
            }
        });

        assertNode(BooleanLiteral, {
            input: "false",
            shouldBe: {
                json: {boolean: false}
            }
        });
    });

});