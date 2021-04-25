import { testSchema } from "./testSchema";

describe("SchemaBuilder: keyword <digits>", () => {

    it("limit <digits>", () => {
        testSchema<{
            limit: number;
        }>({
            schema: "limit <limit>",
            where: {
                limit: Number
            },
            examples: [
                {
                    input: "limit 10",
                    shouldBe: {
                        json: {
                            limit: 10
                        }
                    }
                },
                {
                    input: "limit 9",
                    shouldBe: {
                        json: {
                            limit: 9
                        }
                    }
                }
            ]
        });
    });

    it("offset <digits>", () => {
        testSchema<{
            offset: number;
        }>({
            schema: "offset <offset>",
            where: {
                offset: Number
            },
            examples: [
                {
                    input: "offset 1000",
                    shouldBe: {
                        json: {
                            offset: 1000
                        }
                    }
                },
                {
                    input: "offset 99",
                    shouldBe: {
                        json: {
                            offset: 99
                        }
                    }
                }
            ]
        });
    });

});