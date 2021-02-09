import * as assert from "assert";
import { Position } from "../Position";
import { Token } from "../Token";

describe("Token", () => {

    it("token is equal something", () => {
        const token = new Token(
            "hello",
            new Position(0, 5)
        );

        assert.ok( token.is("hello"), "token is 'hello'" );
        assert.ok( token.is("hello"), "token is not 'world'" );
    });

});