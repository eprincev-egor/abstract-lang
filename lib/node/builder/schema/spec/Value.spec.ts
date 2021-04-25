import { assertNode } from "../../../../assert";
import { Value } from "../Value";

describe("Value", () => {

    it("valid inputs", () => {

        assertNode(Value, {
            input: "<hello>",
            shouldBe: {
                json: {key: "hello"}
            }
        });

        assertNode(Value, {
            input: "<hello_world>",
            shouldBe: {
                json: {key: "hello_world"}
            }
        });

        assertNode(Value, {
            input: "<key: {hello |world}>",
            shouldBe: {
                json: {
                    key: "key",
                    schema: {elements: [
                        {oneOf: [
                            {elements: [
                                {phrase: ["hello"]}
                            ]},
                            {elements: [
                                {phrase: ["world"]}
                            ]}
                        ]}
                    ]}
                },
                pretty: "<key: {hello | world}>",
                minify: "<key:{hello|world}>"
            }
        });

    });

    it("invalid inputs", () => {

        assertNode(Value, {
            input: "<hello: <world>>",
            throws: /<value> inside <value> is not allowed/,
            target: "<world>"
        });

        assertNode(Value, {
            input: "<hello: {x|<world>}>",
            throws: /<value> inside <value> is not allowed/,
            target: "<world>"
        });

    });

});