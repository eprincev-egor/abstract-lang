import { NodeBuilder } from "../NodeBuilder";
import assert from "assert";

describe("NodeBuilder: invalid schemas", () => {

    it("required <place> for description", () => {
        assert.throws(() => {
            NodeBuilder.build({
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
            NodeBuilder.build({
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