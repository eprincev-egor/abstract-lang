/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as assert from "assert";
import { Token, TokenDescription } from "../Token";
import { TokenMap } from "../TokenMap";

describe("TokenMap", () => {

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

    it("getDescription() get AnyCharToken", () => {
        const map = new TokenMap([
            AnyCharToken
        ]);
        const actualClass = map.getTokenClass("a");
        assert.ok(
            actualClass === AnyCharToken
        );
    });

    it("getDescription() get NumberToken from number char", () => {
        const map = new TokenMap([
            NumberToken,
            AnyCharToken
        ]);
        const actualClass = map.getTokenClass("1");
        assert.ok(
            actualClass === NumberToken
        );
    });

    it("getDescription() get NumberToken from some symbol", () => {
        const map = new TokenMap([
            NumberToken,
            AnyCharToken
        ]);
        const actualClass = map.getTokenClass("x");
        assert.ok(
            actualClass === AnyCharToken
        );
    });

    it("speedup getDescription() by popular entry", () => {

        const regExp = new RegExp("[0-7]");
        regExp.test = () => true;

        class PopularNumberToken extends Token {
            static description: TokenDescription = {
                entry: regExp,
                popularEntry: ["8", "9"]
            };
        }

        const map = new TokenMap([
            PopularNumberToken,
            AnyCharToken
        ]);
        const actualClass = map.getTokenClass("9");
        assert.ok(
            actualClass === PopularNumberToken
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
            new TokenMap([
                FooToken,
                BarToken
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
                entry: /[abr]/
            };
        }

        const map = new TokenMap([
            BarToken
        ]);

        const result = map.getTokenClass("x");
        assert.strictEqual(result, undefined);
    });

    it("getDescription() popular entry chars must match entry regExp", () => {
        class BarToken extends Token {
            static description: TokenDescription = {
                entry: /[0-2]/,
                popularEntry: ["2", "3"]
            };
        }

        assert.throws(() => {
            new TokenMap([
                BarToken
            ]);
        }, (err: Error) =>
            /BarToken: popular entry char "3" does not match entry: \/\[0-2]\//.test(err.message)
        );
    });
});