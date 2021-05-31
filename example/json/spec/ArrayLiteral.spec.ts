import { JsonLang } from "../JsonLang";
import { ArrayLiteral } from "../index";

describe("ArrayLiteral", () => {

    it("valid inputs", () => {
        JsonLang.assertNode(ArrayLiteral, {
            input: "[]",
            shouldBe: {
                json: {
                    array: []
                }
            }
        });

        JsonLang.assertNode(ArrayLiteral, {
            input: "[[1]]",
            shouldBe: {
                json: {
                    array: [{
                        array: [
                            {number: "1"}
                        ]
                    }]
                }
            }
        });

        JsonLang.assertNode(ArrayLiteral, {
            input: "[{}]",
            shouldBe: {
                json: {
                    array: [{
                        object: []
                    }]
                }
            }
        });

        JsonLang.assertNode(ArrayLiteral, {
            input: "[1,2,3]",
            shouldBe: {
                json: {
                    array: [
                        {number: "1"},
                        {number: "2"},
                        {number: "3"}
                    ]
                },
                pretty: "[1, 2, 3]"
            }
        });


        JsonLang.assertNode(ArrayLiteral, {
            input: "[\ntrue, null,1,\"test\"]",
            shouldBe: {
                json: {
                    array: [
                        {boolean: true},
                        {null: true},
                        {number: "1"},
                        {string: "test"}
                    ]
                },
                pretty: "[true, null, 1, \"test\"]",
                minify: "[true,null,1,\"test\"]"
            }
        });
    });

});