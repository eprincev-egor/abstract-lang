import assert from "assert";
import { WordToken } from "../../token";
import { SourceCode } from "../SourceCode";

describe("SourceCode", () => {

    it("throw on outside token", () => {
        const code = new SourceCode([]);
        assert.throws(() => {
            code.getCoords(987654321);
        }, (err: Error) =>
            /not found line for char position: 987654321/.test(err.message)
        );
    });

    it("constructor params as string", () => {
        const code = new SourceCode([
            new WordToken("hello", 0)
        ]);
        assert.strictEqual( code.tokens.join(""), "hello" );
    });

});