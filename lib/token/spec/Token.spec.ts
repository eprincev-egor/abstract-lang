import assert from "assert";
import { Token } from "../Token";

describe("Token", () => {

    let token!: Token;
    beforeEach(() => {
        token = new Token("hello", 0);
    });

    it("is(string) equal token value", () => {
        assert.ok( token.is("hello"), "token is 'hello'" );
        assert.ok( token.is("hello"), "token is not 'world'" );
    });

    it("startsWith(string) => token.value.startsWith(...)", () => {
        assert.ok( token.startsWith("h"), "token starts with 'h'" );
        assert.ok( !token.startsWith("H"), "token starts with 'h'" );
    });

    it("startsWith(string) should work in IE", () => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const startsWith = String.prototype.startsWith;
        /* istanbul ignore next */
        String.prototype.startsWith = () => false;

        const result = token.startsWith("h");

        String.prototype.startsWith = startsWith;

        assert.ok( result );
    });
});