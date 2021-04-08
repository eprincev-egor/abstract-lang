import { assertNode } from "abstract-lang";
import { JsonNode } from "../index";

describe("JsonNode", () => {

    it("valid inputs", () => {
        assertNode(JsonNode, {
            input: "null",
            shouldBe: {
                json: {
                    json: {null: true}
                }
            }
        });

        assertNode(JsonNode, {
            input: "false",
            shouldBe: {
                json: {
                    json: {boolean: false}
                }
            }
        });

        assertNode(JsonNode, {
            input: "true",
            shouldBe: {
                json: {
                    json: {boolean: true}
                }
            }
        });

        assertNode(JsonNode, {
            input: "-0.5",
            shouldBe: {
                json: {
                    json: {number: "-0.5"}
                }
            }
        });

        assertNode(JsonNode, {
            input: "\" \"",
            shouldBe: {
                json: {
                    json: {string: " "}
                }
            }
        });

        assertNode(JsonNode, {
            input: "[]",
            shouldBe: {
                json: {
                    json: {array: []}
                }
            }
        });

        assertNode(JsonNode, {
            input: "{}",
            shouldBe: {
                json: {
                    json: {object: []}
                }
            }
        });
    });

    it("invalid inputs", () => {
        assertNode(JsonNode, {
            input: "!",
            throws: /expected json element/
        });
    });

});