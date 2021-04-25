import { SchemaBuilder } from "../SchemaBuilder";
import assert from "assert";

describe("SchemaBuilder: invalid schemas", () => {

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