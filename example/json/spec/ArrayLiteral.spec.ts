import { assertNode } from "abstract-lang";
import { ArrayLiteral } from "../index";

describe("ArrayLiteral", () => {

    it("valid inputs", () => {
        assertNode(ArrayLiteral, {
            input: "[]",
            shouldBe: {
                json: {
                    array: []
                }
            }
        });

        assertNode(ArrayLiteral, {
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

        assertNode(ArrayLiteral, {
            input: "[{}]",
            shouldBe: {
                json: {
                    array: [{
                        object: []
                    }]
                }
            }
        });

        assertNode(ArrayLiteral, {
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


        assertNode(ArrayLiteral, {
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