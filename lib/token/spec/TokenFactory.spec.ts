/* eslint-disable @typescript-eslint/no-non-null-assertion */
import assert from "assert";
import { Token, TokenDescription } from "../Token";
import { TokenFactory } from "../TokenFactory";

describe("TokenFactory", () => {

    class AnyCharToken extends Token {
        static description: TokenDescription = {
            entry: /./
        };
    }

    class NumberToken extends Token {
        static description: TokenDescription = {
            entry: /\d/
        };
    }

    it("getTokenClass() get AnyCharToken", () => {
        const map = new TokenFactory([
            AnyCharToken
        ]);
        const result = map.getTokenClass("a");
        assert.ok(
            result &&
            result.TokenClass === AnyCharToken
        );
    });

    it("getTokenClass() get NumberToken from number char", () => {
        const map = new TokenFactory([
            NumberToken,
            AnyCharToken
        ]);
        const result = map.getTokenClass("1");
        assert.ok(
            result &&
            result.TokenClass === NumberToken
        );
    });

    it("getTokenClass() get NumberToken from some symbol", () => {
        const map = new TokenFactory([
            NumberToken,
            AnyCharToken
        ]);
        const result = map.getTokenClass("x");
        assert.ok(
            result &&
            result.TokenClass === AnyCharToken
        );
    });

    it("speedup getTokenClass() by popular entry", () => {

        const regExp = new RegExp("[0-7]");
        regExp.test = () => true;

        class PopularNumberToken extends Token {
            static description: TokenDescription = {
                entry: regExp,
                popularEntry: ["8", "9"]
            };
        }

        const map = new TokenFactory([
            PopularNumberToken,
            AnyCharToken
        ]);
        const result = map.getTokenClass("9");
        assert.ok(
            result &&
            result.TokenClass === PopularNumberToken
        );
    });

    it("error on duplicated popular char", () => {

        class FooToken extends Token {
            static description: TokenDescription = {
                entry: /./,
                popularEntry: ["1"]
            };
        }
        class BarToken extends Token {
            static description: TokenDescription = {
                entry: /./,
                popularEntry: ["0", "1"]
            };
        }

        assert.throws(() => {
            new TokenFactory([
                FooToken,
                BarToken
            ]);
        }, (err: Error) =>
            /duplicated popular entry char: "1" between FooToken and BarToken/.test(err.message)
        );
    });

    it("required one more description", () => {

        assert.throws(() => {
            new TokenFactory([]);
        }, (err: Error) =>
            /one or more token descriptions required/.test(err.message)
        );
    });

    it("getTokenClass() returns undefined when token for char not found", () => {
        class BarToken extends Token {
            static description: TokenDescription = {
                entry: /[abr]/
            };
        }

        const map = new TokenFactory([
            BarToken
        ]);

        const result = map.getTokenClass("x");
        assert.strictEqual(result, undefined);
    });

    it("getTokenClass() popular entry chars must match entry regExp", () => {
        class BarToken extends Token {
            static description: TokenDescription = {
                entry: /[0-2]/,
                popularEntry: ["2", "3"]
            };
        }

        assert.throws(() => {
            new TokenFactory([
                BarToken
            ]);
        }, (err: Error) =>
            /BarToken: popular entry char "3" does not match entry: \/\[0-2]\//.test(err.message)
        );
    });
});