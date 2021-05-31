import { JsonLang } from "../JsonLang";
import { NumberLiteral } from "../index";

describe("NumberLiteral", () => {

    it("valid inputs", () => {
        JsonLang.assertNode(NumberLiteral, {
            input: "0",
            shouldBe: {
                json: {number: "0"}
            }
        });

        JsonLang.assertNode(NumberLiteral, {
            input: "1",
            shouldBe: {
                json: {number: "1"}
            }
        });

        JsonLang.assertNode(NumberLiteral, {
            input: "1.10",
            shouldBe: {
                json: {number: "1.10"}
            }
        });

        JsonLang.assertNode(NumberLiteral, {
            input: "123456789",
            shouldBe: {
                json: {number: "123456789"}
            }
        });

        JsonLang.assertNode(NumberLiteral, {
            input: "-20",
            shouldBe: {
                json: {number: "-20"}
            }
        });

        JsonLang.assertNode(NumberLiteral, {
            input: "-20.5",
            shouldBe: {
                json: {number: "-20.5"}
            }
        });

        JsonLang.assertNode(NumberLiteral, {
            input: "1e10",
            shouldBe: {
                json: {number: "1e10"}
            }
        });

        JsonLang.assertNode(NumberLiteral, {
            input: "1.05e10",
            shouldBe: {
                json: {number: "1.05e10"}
            }
        });
    });

});