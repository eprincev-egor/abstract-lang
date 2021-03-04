import assert from "assert";
import { DigitsToken } from "../default/DigitsToken";
import { SpaceToken } from "../default/SpaceToken";
import { Tokenizer } from "../Tokenizer";
import { TokenMap } from "../TokenMap";
import { Token, TokenDescription } from "../Token";
import { EndOfFleToken } from "../EndOfFileToken";
import { EndOfLineToken } from "../default/EndOfLineToken";

describe("Tokenizer", () => {

    const map = new TokenMap([
        EndOfLineToken,
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
                    position: 0
                },
                {
                    value: "",
                    position: 10
                }
            ]
        );
    });

    it("tokenize digits and spaces",() => {

        const tokens = Tokenizer.tokenize(
            map,
            "012 23\n44\r66    \t\r\n"
        );

        assert.strictEqual(tokens.length, 10);

        assert.ok(tokens[0] instanceof DigitsToken, "tokens[0] is digits");
        assert.ok(tokens[1] instanceof SpaceToken, "tokens[1] is spaces");
        assert.ok(tokens[2] instanceof DigitsToken, "tokens[2] is digits");

        assert.deepStrictEqual(
            tokens.map((token) => token.toJSON()),
            [
                {
                    value: "012",
                    position: 0
                },
                {
                    value: " ",
                    position: 3
                },
                {
                    value: "23",
                    position: 4
                },
                {
                    value: "\n",
                    position: 6
                },
                {
                    value: "44",
                    position: 7
                },
                {
                    value: "\r",
                    position: 9
                },
                {
                    value: "66",
                    position: 10
                },
                {
                    value: "    \t",
                    position: 12
                },
                {
                    value: "\r\n",
                    position: 17
                },
                {
                    value: "",
                    position: 19
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
                    position: 0
                },
                {
                    value: "w",
                    position: 1
                },
                {
                    value: "e",
                    position: 2
                },
                {
                    value: "",
                    position: 3
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