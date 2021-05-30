import { BaseParser } from "abstract-lang";
import { JsonNode } from "../index";

describe("JsonNode", () => {

    it("valid inputs", () => {
        BaseParser.assertNode(JsonNode, {
            input: "null",
            shouldBe: {
                json: {
                    json: {null: true}
                }
            }
        });

        BaseParser.assertNode(JsonNode, {
            input: "false",
            shouldBe: {
                json: {
                    json: {boolean: false}
                }
            }
        });

        BaseParser.assertNode(JsonNode, {
            input: "true",
            shouldBe: {
                json: {
                    json: {boolean: true}
                }
            }
        });

        BaseParser.assertNode(JsonNode, {
            input: "-0.5",
            shouldBe: {
                json: {
                    json: {number: "-0.5"}
                }
            }
        });

        BaseParser.assertNode(JsonNode, {
            input: "\" \"",
            shouldBe: {
                json: {
                    json: {string: " "}
                }
            }
        });

        BaseParser.assertNode(JsonNode, {
            input: "[]",
            shouldBe: {
                json: {
                    json: {array: []}
                }
            }
        });

        BaseParser.assertNode(JsonNode, {
            input: "{}",
            shouldBe: {
                json: {
                    json: {object: []}
                }
            }
        });
    });

    it("invalid inputs", () => {
        BaseParser.assertNode(JsonNode, {
            input: "!",
            throws: /expected json element/,
            target: "!"
        });
    });

});