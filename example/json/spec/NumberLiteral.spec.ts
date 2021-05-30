import { BaseParser } from "abstract-lang";
import { NumberLiteral } from "../index";

describe("NumberLiteral", () => {

    it("valid inputs", () => {
        BaseParser.assertNode(NumberLiteral, {
            input: "0",
            shouldBe: {
                json: {number: "0"}
            }
        });

        BaseParser.assertNode(NumberLiteral, {
            input: "1",
            shouldBe: {
                json: {number: "1"}
            }
        });

        BaseParser.assertNode(NumberLiteral, {
            input: "1.10",
            shouldBe: {
                json: {number: "1.10"}
            }
        });

        BaseParser.assertNode(NumberLiteral, {
            input: "123456789",
            shouldBe: {
                json: {number: "123456789"}
            }
        });

        BaseParser.assertNode(NumberLiteral, {
            input: "-20",
            shouldBe: {
                json: {number: "-20"}
            }
        });

        BaseParser.assertNode(NumberLiteral, {
            input: "-20.5",
            shouldBe: {
                json: {number: "-20.5"}
            }
        });

        BaseParser.assertNode(NumberLiteral, {
            input: "1e10",
            shouldBe: {
                json: {number: "1e10"}
            }
        });

        BaseParser.assertNode(NumberLiteral, {
            input: "1.05e10",
            shouldBe: {
                json: {number: "1.05e10"}
            }
        });
    });

});