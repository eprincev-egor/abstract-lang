import { testSchema } from "./testSchema";

describe("SchemaBuilder: {x | y}", () => {

    it("fetch <fetch: {first|next}> rows", () => {
        testSchema<{
            fetch: "first" | "next";
        }>({
            schema: "fetch <fetch: {first|next}> rows",
            where: {
                fetch: String
            },
            examples: [
                {
                    input: "fetch first rows",
                    shouldBe: {
                        json: {
                            fetch: "first"
                        }
                    }
                },
                {
                    input: "fetch next rows",
                    shouldBe: {
                        json: {
                            fetch: "next"
                        }
                    }
                },
                {
                    input: "fetch wrong rows",
                    throws: /unexpected token: "wrong", expected one of: first \| next/,
                    target: "wrong"
                }
            ]
        });
    });

});