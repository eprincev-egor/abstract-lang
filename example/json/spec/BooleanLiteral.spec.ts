import { BooleanLiteral } from "../BooleanLiteral";
import assert from "assert";

describe("BooleanLiteral", () => {

    it("first", () => {
        const bool = new BooleanLiteral(true);
        assert.ok( bool instanceof BooleanLiteral );
    });
});