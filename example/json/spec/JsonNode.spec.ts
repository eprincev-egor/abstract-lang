import { JsonLang } from "../JsonLang";
import { JsonNode } from "../index";

describe("JsonNode", () => {

    it("valid inputs", () => {
        JsonLang.assertNode(JsonNode, {
            input: "null",
            shouldBe: {
                json: {
                    json: {null: true}
                }
            }
        });

        JsonLang.assertNode(JsonNode, {
            input: "false",
            shouldBe: {
                json: {
                    json: {boolean: false}
                }
            }
        });

        JsonLang.assertNode(JsonNode, {
            input: "true",
            shouldBe: {
                json: {
                    json: {boolean: true}
                }
            }
        });

        JsonLang.assertNode(JsonNode, {
            input: "-0.5",
            shouldBe: {
                json: {
                    json: {number: "-0.5"}
                }
            }
        });

        JsonLang.assertNode(JsonNode, {
            input: "\" \"",
            shouldBe: {
                json: {
                    json: {string: " "}
                }
            }
        });

        JsonLang.assertNode(JsonNode, {
            input: "[]",
            shouldBe: {
                json: {
                    json: {array: []}
                }
            }
        });

        JsonLang.assertNode(JsonNode, {
            input: "{}",
            shouldBe: {
                json: {
                    json: {object: []}
                }
            }
        });
    });

    it("invalid inputs", () => {
        JsonLang.assertNode(JsonNode, {
            input: "!",
            throws: /expected json element/,
            target: "!"
        });
    });

});