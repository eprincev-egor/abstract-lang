import { BaseParser } from "abstract-lang";
import { ArrayLiteral } from "../index";

describe("ArrayLiteral", () => {

    it("valid inputs", () => {
        BaseParser.assertNode(ArrayLiteral, {
            input: "[]",
            shouldBe: {
                json: {
                    array: []
                }
            }
        });

        BaseParser.assertNode(ArrayLiteral, {
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

        BaseParser.assertNode(ArrayLiteral, {
            input: "[{}]",
            shouldBe: {
                json: {
                    array: [{
                        object: []
                    }]
                }
            }
        });

        BaseParser.assertNode(ArrayLiteral, {
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


        BaseParser.assertNode(ArrayLiteral, {
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