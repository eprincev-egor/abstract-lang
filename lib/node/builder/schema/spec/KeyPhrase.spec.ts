import { assertNode } from "../../../../assert";
import { KeyPhrase } from "../KeyPhrase";

describe("KeyPhrase", () => {

    it("valid inputs", () => {

        assertNode(KeyPhrase, {
            input: "hello",
            shouldBe: {
                json: {phrase: ["hello"]}
            }
        });

        assertNode(KeyPhrase, {
            input: "hello_world",
            shouldBe: {
                json: {phrase: ["hello_world"]}
            }
        });

        assertNode(KeyPhrase, {
            input: "hello world",
            shouldBe: {
                json: {phrase: ["hello", "world"]}
            }
        });

        assertNode(KeyPhrase, {
            input: "hello\nworld",
            shouldBe: {
                json: {phrase: ["hello", "world"]},
                pretty: "hello world",
                minify: "hello world"
            }
        });

    });

});