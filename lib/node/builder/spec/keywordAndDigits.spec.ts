import { testBuilder } from "./testBuilder";

describe("NodeBuilder: keyword <digits>", () => {

    it("limit <digits>", () => {
        testBuilder<{
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
        testBuilder<{
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