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

    describe("validate token classes", () => {

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

        it("popular entry chars must match entry regExp", () => {
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

    describe("createToken(text, position)", () => {

        it("create AnyCharToken", () => {
            const factory = new TokenFactory([
                AnyCharToken
            ]);
            const token = factory.createToken("a", 0);
            assert.ok(
                token instanceof AnyCharToken
            );
        });

        it("NumberToken from digit", () => {
            const factory = new TokenFactory([
                NumberToken,
                AnyCharToken
            ]);
            const token = factory.createToken("1", 0);
            assert.ok(
                token instanceof NumberToken
            );
        });

        it("create AnyCharToken instead of  NumberToken", () => {
            const factory = new TokenFactory([
                NumberToken,
                AnyCharToken
            ]);
            const token = factory.createToken("x", 0);
            assert.ok(
                token instanceof AnyCharToken
            );
        });

        it("speedup by popular entry", () => {

            const regExp = new RegExp("[0-7]");
            regExp.test = () => true;

            class PopularNumberToken extends Token {
                static description: TokenDescription = {
                    entry: regExp,
                    popularEntry: ["8", "9"]
                };
            }

            const factory = new TokenFactory([
                PopularNumberToken,
                AnyCharToken
            ]);
            const token = factory.createToken("9", 0);
            assert.ok(
                token instanceof PopularNumberToken
            );
        });

        it("create default Token when special class for char not found", () => {
            class BarToken extends Token {
                static description: TokenDescription = {
                    entry: /[abr]/
                };
            }

            const factory = new TokenFactory([
                BarToken
            ]);

            const token = factory.createToken("x", 0);
            assert.ok(
                token instanceof Token
            );
        });

        it("create token with maxLength and popularEntry and entry as RegExp", () => {
            class SomeToken extends Token {
                static description: TokenDescription = {
                    entry: /\d/,
                    popularEntry: ["2"],
                    maxLength: 10
                };
            }

            const factory = new TokenFactory([
                SomeToken
            ]);
            const token = factory.createToken("1234abcdef", 0);
            assert.ok(
                token instanceof SomeToken &&
                token.length === 4 &&
                token.value === "1234"
            );
        });

        it("create token with maxLength and entry as RegExp", () => {
            class SomeToken extends Token {
                static description: TokenDescription = {
                    entry: /./,
                    maxLength: 4
                };
            }

            const factory = new TokenFactory([
                SomeToken
            ]);
            const token = factory.createToken("123456789", 0);
            assert.ok(
                token instanceof SomeToken &&
                token.length === 4 &&
                token.value === "1234"
            );
        });

        it("create token with maxLength and entry as string[]", () => {
            class SomeToken extends Token {
                static description: TokenDescription = {
                    entry: ["a", "b", "c", "d"],
                    maxLength: 10
                };
            }

            const factory = new TokenFactory([
                SomeToken
            ]);
            const token = factory.createToken("abcdef", 0);
            assert.ok(
                token instanceof SomeToken &&
                token.length === 4 &&
                token.value === "abcd"
            );
        });

    });

});