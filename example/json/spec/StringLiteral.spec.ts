import { assertNode } from "abstract-lang";
import { StringLiteral } from "../index";

describe("StringLiteral", () => {

    it("valid inputs", () => {
        assertNode(StringLiteral, {
            input: "\"hello\"",
            shouldBe: {
                json: {string: "hello"}
            }
        });

        assertNode(StringLiteral, {
            input: "\"\"",
            shouldBe: {
                json: {string: ""}
            }
        });

        assertNode(StringLiteral, {
            input: "\"he\\\\llo\"",
            shouldBe: {
                json: {string: "he\\llo"}
            }
        });
    });

});