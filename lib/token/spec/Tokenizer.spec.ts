import * as assert from "assert";
import { DigitsToken } from "../default/DigitsToken";
import { SpaceToken } from "../default/SpaceToken";
import { Tokenizer } from "../Tokenizer";
import { TokenMap } from "../TokenMap";
import { Token, TokenDescription } from "../Token";
import { EndOfFleToken } from "../EndOfFileToken";

describe("Tokenizer", () => {

    const map = new TokenMap([
        SpaceToken,
        DigitsToken
    ]);

    it("tokenize digits",() => {

        const tokens = Tokenizer.tokenize(
            map,
            "0123456789"
        );

        assert.strictEqual(tokens.length, 2);

        assert.ok(tokens[0] instanceof DigitsToken);
        assert.deepStrictEqual(
            tokens.map((token) => token.toJSON()),
            [
                {
                    value: "0123456789",
                    position: {start: 0, end: 10}
                },
                {
                    value: "",
                    position: {start: 10, end: 10}
                }
            ]
        );
    });

    it("tokenize digits and spaces",() => {

        const tokens = Tokenizer.tokenize(
            map,
            "012 23\n44\r66    \t\r\n"
        );

        assert.strictEqual(tokens.length, 9);

        assert.ok(tokens[0] instanceof DigitsToken, "tokens[0] is digits");
        assert.ok(tokens[1] instanceof SpaceToken, "tokens[1] is spaces");
        assert.ok(tokens[2] instanceof DigitsToken, "tokens[2] is digits");

        assert.deepStrictEqual(
            tokens.map((token) => token.toJSON()),
            [
                {
                    value: "012",
                    position: {start: 0, end: 3}
                },
                {
                    value: " ",
                    position: {start: 3, end: 4}
                },
                {
                    value: "23",
                    position: {start: 4, end: 6}
                },
                {
                    value: "\n",
                    position: {start: 6, end: 7}
                },
                {
                    value: "44",
                    position: {start: 7, end: 9}
                },
                {
                    value: "\r",
                    position: {start: 9, end: 10}
                },
                {
                    value: "66",
                    position: {start: 10, end: 12}
                },
                {
                    value: "    \t\r\n",
                    position: {start: 12, end: 19}
                },
                {
                    value: "",
                    position: {start: 19, end: 19}
                }
            ]
        );
    });

    it("tokenize unknown symbols by one-symbol per token",() => {
        const map = new TokenMap([
            DigitsToken
        ]);

        const tokens = Tokenizer.tokenize(
            map,
            "qwe"
        );

        assert.strictEqual(tokens.length, 4);

        assert.ok(tokens[0] instanceof Token);
        assert.ok(tokens[1] instanceof Token);
        assert.ok(tokens[2] instanceof Token);

        assert.deepStrictEqual(
            tokens.map((token) => token.toJSON()),
            [
                {
                    value: "q",
                    position: {start: 0, end: 1}
                },
                {
                    value: "w",
                    position: {start: 1, end: 2}
                },
                {
                    value: "e",
                    position: {start: 2, end: 3}
                },
                {
                    value: "",
                    position: {start: 3, end: 3}
                }
            ]
        );
    });

    it("TokenClass can be single-char",() => {
        class OperatorToken extends Token {
            static description: TokenDescription = {
                entry: /[*+/-]/,
                popularEntry: ["*", "+", "/", "-"],
                maxLength: 1
            }
        }

        const map = new TokenMap([
            OperatorToken
        ]);
        const tokens = Tokenizer.tokenize(
            map,
            "--++1"
        );
        assert.strictEqual(tokens.length, 6);

        assert.ok(tokens[0] instanceof OperatorToken, "[0]");
        assert.ok(tokens[1] instanceof OperatorToken, "[1]");
        assert.ok(tokens[2] instanceof OperatorToken, "[2]");
        assert.ok(tokens[3] instanceof OperatorToken, "[3]");
        assert.ok( !(tokens[4] instanceof OperatorToken), "[4]" );
    });

    it("last token should be EndOfFleToken",() => {

        const tokens = Tokenizer.tokenize(
            map,
            "1"
        );
        assert.strictEqual(tokens.length, 2);
        assert.ok(tokens[1] instanceof EndOfFleToken, "[1] is EndOfFleToken");
    });
});