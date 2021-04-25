import { assertNode } from "../../../../assert";
import { Schema } from "../Schema";

describe("Schema", () => {

    it("valid inputs", () => {

        assertNode(Schema, {
            input: "hello <hello>",
            shouldBe: {
                json: {
                    elements: [
                        {phrase: ["hello"]},
                        {key: "hello"}
                    ]
                }
            }
        });

        assertNode(Schema, {
            input: "{x | y | z}",
            shouldBe: {
                json: {
                    elements: [
                        {oneOf: [
                            {elements: [
                                {phrase: ["x"]}
                            ]},
                            {elements: [
                                {phrase: ["y"]}
                            ]},
                            {elements: [
                                {phrase: ["z"]}
                            ]}
                        ]}
                    ]
                },
                minify: "{x|y|z}"
            }
        });

    });

});