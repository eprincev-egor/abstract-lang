import * as assert from "assert";
import { Token } from "../Token";

describe("Token", () => {

    it("token is equal something", () => {
        const token = new Token("hello", 0);

        assert.ok( token.is("hello"), "token is 'hello'" );
        assert.ok( token.is("hello"), "token is not 'world'" );
    });

});