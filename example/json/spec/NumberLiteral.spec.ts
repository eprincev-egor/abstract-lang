import { assertNode } from "abstract-lang";
import { NumberLiteral } from "../index";

describe("NumberLiteral", () => {

    it("valid inputs", () => {
        assertNode(NumberLiteral, {
            input: "0",
            shouldBe: {
                json: {number: "0"}
            }
        });

        assertNode(NumberLiteral, {
            input: "1",
            shouldBe: {
                json: {number: "1"}
            }
        });

        assertNode(NumberLiteral, {
            input: "1.10",
            shouldBe: {
                json: {number: "1.10"}
            }
        });

        assertNode(NumberLiteral, {
            input: "123456789",
            shouldBe: {
                json: {number: "123456789"}
            }
        });

        assertNode(NumberLiteral, {
            input: "-20",
            shouldBe: {
                json: {number: "-20"}
            }
        });

        assertNode(NumberLiteral, {
            input: "-20.5",
            shouldBe: {
                json: {number: "-20.5"}
            }
        });

        assertNode(NumberLiteral, {
            input: "1e10",
            shouldBe: {
                json: {number: "1e10"}
            }
        });

        assertNode(NumberLiteral, {
            input: "1.05e10",
            shouldBe: {
                json: {number: "1.05e10"}
            }
        });
    });

});