import assert from "assert";
import { MinifySpaces, PrettySpaces } from "node";
import { SourceCode } from "../../source";
import { SchemaBuilder } from "../SchemaBuilder";

describe("SchemaBuilder", () => {

    it("limit <digits>", () => {
        interface LimitRow {
            limit: number;
        }

        const schema = SchemaBuilder.build<LimitRow>({
            schema: "limit <limit>",
            where: {
                limit: Number
            }
        });

        const source = new SourceCode("limit 10");

        assert.ok( schema.entry(source.cursor), "entry");

        const limitRow = schema.parse(source.cursor);
        assert.deepStrictEqual(limitRow, {
            limit: 10
        }, "parse");

        const pretty = schema.serialize(limitRow, PrettySpaces);
        assert.strictEqual(pretty, "limit 10", "pretty");

        const minify = schema.serialize(limitRow, MinifySpaces);
        assert.strictEqual(minify, "limit 10", "minify");
    });

    it("offset <digits>", () => {
        interface OffsetRow {
            offset: number;
        }

        const schema = SchemaBuilder.build<OffsetRow>({
            schema: "offset <offset>",
            where: {
                offset: Number
            }
        });

        const source = new SourceCode("offset 1000");

        assert.ok( schema.entry(source.cursor), "entry");

        const offsetRow = schema.parse(source.cursor);
        assert.deepStrictEqual(offsetRow, {
            offset: 1000
        }, "parse");

        const pretty = schema.serialize(offsetRow, PrettySpaces);
        assert.strictEqual(pretty, "offset 1000", "pretty");

        const minify = schema.serialize(offsetRow, MinifySpaces);
        assert.strictEqual(minify, "offset 1000", "minify");
    });

});