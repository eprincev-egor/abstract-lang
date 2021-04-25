import assert from "assert";
import { SchemaBuilder } from "../SchemaBuilder";
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

    it("required <place> for description", () => {
        assert.throws(() => {
            SchemaBuilder.build({
                schema: "offset offset",
                where: {
                    offset: Number
                }
            });
        }, (err: Error) =>
            /required <offset> inside schema: offset offset/.test(err.message)
        );
    });

    it("required description for <place>", () => {
        assert.throws(() => {
            SchemaBuilder.build({
                schema: "offset <offset> <limit>",
                where: {
                    offset: Number
                }
            });
        }, (err: Error) =>
            /required description for <limit> inside schema: offset <offset> <limit>/.test(err.message)
        );
    });

});