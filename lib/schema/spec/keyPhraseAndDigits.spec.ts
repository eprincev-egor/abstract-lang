import { testSchema } from "./testSchema";

describe("SchemaBuilder: key phrase <digits>", () => {

    it("start from <digits>", () => {
        testSchema<{
            startFrom: number;
        }>({
            schema: "start from <startFrom>",
            where: {
                startFrom: Number
            },
            examples: [
                {
                    input: "start from 1000",
                    shouldBe: {
                        json: {
                            startFrom: 1000
                        }
                    }
                },
                {
                    input: "start\nfrom 99",
                    shouldBe: {
                        json: {
                            startFrom: 99
                        },
                        pretty: "start from 99",
                        minify: "start from 99"
                    }
                }
            ]
        });
    });

    it("one two three <digits>", () => {
        testSchema<{
            four: number;
        }>({
            schema: "one two three <four>",
            where: {
                four: Number
            },
            examples: [{
                input: "one\rtwo\nthree\t4",
                shouldBe: {
                    json: {
                        four: 4
                    },
                    pretty: "one two three 4",
                    minify: "one two three 4"
                }
            }]
        });
    });

});