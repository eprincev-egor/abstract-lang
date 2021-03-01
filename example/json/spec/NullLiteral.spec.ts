import { assertNode } from "abstract-lang";
import { NullLiteral } from "../index";

describe("NullLiteral", () => {

    it("valid inputs", () => {
        assertNode(NullLiteral, {
            input: "null",
            shouldBe: {
                json: {null: true}
            }
        });
    });

});