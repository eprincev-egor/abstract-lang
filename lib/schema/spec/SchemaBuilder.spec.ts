import { testSchema } from "./testSchema";

describe("SchemaBuilder", () => {

    it("limit <digits>", () => {
        testSchema<{
            limit: number;
        }>({
            schema: "limit <limit>",
            where: {
                limit: Number
            },
            input: "limit 10",
            shouldBe: {
                json: {
                    limit: 10
                }
            }
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
            input: "offset 1000",
            shouldBe: {
                json: {
                    offset: 1000
                }
            }
        });
    });

});