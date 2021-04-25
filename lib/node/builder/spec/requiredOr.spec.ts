import { testBuilder } from "./testBuilder";

describe("NodeBuilder: {x | y}", () => {

    it("fetch <fetch: {first|next}> rows", () => {
        testBuilder<{
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

    it("bounds <bounds: { left | right | top | bottom }>", () => {
        testBuilder<{
            bounds: "left" | "right" | "top" | "bottom";
        }>({
            schema: "bounds <bounds: { left | right | top | bottom }>",
            where: {
                bounds: String
            },
            examples: [
                {
                    input: "bounds left",
                    shouldBe: {
                        json: {
                            bounds: "left"
                        }
                    }
                },
                {
                    input: "bounds bottom",
                    shouldBe: {
                        json: {
                            bounds: "bottom"
                        }
                    }
                },
                {
                    input: "bounds unknown",
                    throws: /unexpected token: "unknown", expected one of: left \| right \| top \| bottom/,
                    target: "unknown"
                }
            ]
        });
    });

});