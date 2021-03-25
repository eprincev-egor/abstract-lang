import assert from "assert";
import { SourceCode } from "../SourceCode";

describe("SourceCode", () => {

    it("throw on outside token", () => {
        const code = new SourceCode({text: ""});
        assert.throws(() => {
            code.getCoords(987654321);
        }, (err: Error) =>
            /not found line for char position: 987654321/.test(err.message)
        );
    });

});