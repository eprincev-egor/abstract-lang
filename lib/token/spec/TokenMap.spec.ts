/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as assert from "assert";
import { Token, TokenDescription } from "../Token";
import { TokenMap } from "../TokenMap";

describe("TokenMap", () => {

    class AnyCharToken extends Token {
        static description: TokenDescription = {
            entry: /./,
            TokenConstructor: AnyCharToken
        };
    }

    class NumberToken extends Token {
        static description: TokenDescription = {
            entry: /\d/,
            TokenConstructor: NumberToken
        };
    }

    it("getDescription() get AnyCharToken", () => {
        const map = new TokenMap([
            AnyCharToken.description
        ]);
        const actualDescription = map.getDescription("a");
        assert.ok(
            actualDescription!.TokenConstructor === AnyCharToken
        );
    });

    it("getDescription() get NumberToken from number char", () => {
        const map = new TokenMap([
            NumberToken.description,
            AnyCharToken.description
        ]);
        const actualDescription = map.getDescription("1");
        assert.ok(
            actualDescription!.TokenConstructor === NumberToken
        );
    });

    it("getDescription() get NumberToken from some symbol", () => {
        const map = new TokenMap([
            NumberToken.description,
            AnyCharToken.description
        ]);
        const actualDescription = map.getDescription("x");
        assert.ok(
            actualDescription!.TokenConstructor === AnyCharToken
        );
    });

    it("speedup getDescription() by popular entry", () => {

        const regExp = new RegExp("[0-7]");
        regExp.test = () => true;

        class PopularNumberToken extends Token {
            static description: TokenDescription = {
                entry: regExp,
                popularEntry: ["8", "9"],
                TokenConstructor: PopularNumberToken
            };
        }

        const map = new TokenMap([
            PopularNumberToken.description,
            AnyCharToken.description
        ]);
        const actualDescription = map.getDescription("9");
        assert.ok(
            actualDescription!.TokenConstructor === PopularNumberToken
        );
    });

    it("error on duplicated popular char", () => {

        class FooToken extends Token {
            static description: TokenDescription = {
                entry: /./,
                popularEntry: ["1"],
                TokenConstructor: FooToken
            };
        }
        class BarToken extends Token {
            static description: TokenDescription = {
                entry: /./,
                popularEntry: ["0", "1"],
                TokenConstructor: BarToken
            };
        }

        assert.throws(() => {
            new TokenMap([
                FooToken.description,
                BarToken.description
            ]);
        }, (err: Error) =>
            /duplicated popular entry char: "1" between FooToken and BarToken/.test(err.message)
        );
    });

    it("required one more description", () => {

        assert.throws(() => {
            new TokenMap([]);
        }, (err: Error) =>
            /one or more token descriptions required/.test(err.message)
        );
    });

    it("getDescription() returns undefined when token for char not found", () => {
        class BarToken extends Token {
            static description: TokenDescription = {
                entry: /[abr]/,
                TokenConstructor: BarToken
            };
        }

        const map = new TokenMap([
            BarToken.description
        ]);

        const result = map.getDescription("x");
        assert.strictEqual(result, undefined);
    });

    it("getDescription() popular entry chars must match entry regExp", () => {
        class BarToken extends Token {
            static description: TokenDescription = {
                entry: /[0-2]/,
                popularEntry: ["2", "3"],
                TokenConstructor: BarToken
            };
        }

        assert.throws(() => {
            new TokenMap([
                BarToken.description
            ]);
        }, (err: Error) =>
            /BarToken: popular entry char "3" does not match entry: \/\[0-2]\//.test(err.message)
        );
    });
});