import { BaseParser } from "abstract-lang";
import { ObjectLiteral } from "../index";

describe("ObjectLiteral", () => {

    it("valid inputs", () => {
        BaseParser.assertNode(ObjectLiteral, {
            input: "{}",
            shouldBe: {
                json: {
                    object: []
                }
            }
        });

        BaseParser.assertNode(ObjectLiteral, {
            input: "{\"hello\": \"world\"}",
            shouldBe: {
                json: {
                    object: [
                        {
                            key: {string: "hello"},
                            value: {string: "world"}
                        }
                    ]
                },
                pretty: [
                    "{",
                    "    \"hello\": \"world\"",
                    "}"
                ].join("\n"),
                minify: "{\"hello\":\"world\"}"
            }
        });

        BaseParser.assertNode(ObjectLiteral, {
            input: "{\"a\": 1, \"b\": 2}",
            shouldBe: {
                json: {
                    object: [
                        {
                            key: {string: "a"},
                            value: {number: "1"}
                        },
                        {
                            key: {string: "b"},
                            value: {number: "2"}
                        }
                    ]
                },
                pretty: [
                    "{",
                    "    \"a\": 1,",
                    "    \"b\": 2",
                    "}"
                ].join("\n"),
                minify: "{\"a\":1,\"b\":2}"
            }
        });

        BaseParser.assertNode(ObjectLiteral, {
            input: "{\"a\": [ ]}",
            shouldBe: {
                json: {
                    object: [
                        {
                            key: {string: "a"},
                            value: {array: []}
                        }
                    ]
                },
                pretty: [
                    "{",
                    "    \"a\": []",
                    "}"
                ].join("\n"),
                minify: "{\"a\":[]}"
            }
        });
    });

});