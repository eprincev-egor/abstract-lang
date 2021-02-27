import { BooleanLiteral } from "../BooleanLiteral";
import assert from "assert";

describe("BooleanLiteral", () => {

    it("first", () => {
        const bool = new BooleanLiteral({boolean: true});
        assert.ok( bool instanceof BooleanLiteral );
    });
});