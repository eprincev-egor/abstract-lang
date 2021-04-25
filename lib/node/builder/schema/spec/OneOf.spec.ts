import { assertNode } from "../../../../assert";
import { OneOf } from "../OneOf";

describe("OneOf", () => {

    it("valid inputs", () => {

        assertNode(OneOf, {
            input: "{hello | world}",
            shouldBe: {
                json: {
                    oneOf: [
                        {elements: [
                            {phrase: ["hello"]}
                        ]},
                        {elements: [
                            {phrase: ["world"]}
                        ]}
                    ]
                },
                minify: "{hello|world}"
            }
        });

    });

});