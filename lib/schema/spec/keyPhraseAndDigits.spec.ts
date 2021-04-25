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

});