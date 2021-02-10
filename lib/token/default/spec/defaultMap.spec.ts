import * as assert from "assert";
import { Tokenizer } from "../../Tokenizer";
import { BracketsToken } from "../BracketsToken";
import { defaultMap } from "../defaultMap";
import { DigitsToken } from "../DigitsToken";
import { OperatorsToken } from "../OperatorsToken";
import { QuotesToken } from "../QuotesToken";
import { SpaceToken } from "../SpaceToken";
import { WordToken } from "../WordToken";

describe("defaultMap", () => {

    it("all variants of tokens", () => {
        const tokens = Tokenizer.tokenize(
            defaultMap,
            [
                "hello world\r\n__\tHELLO_WORLD",
                "(test){brackets}[variants]",
                "'single'\"double\\\"\"`and that`",
                "123\t\t456\t7890",
                "%+-*/~!.><=^&&||?"
            ].join("")
        );

        const actualTokens = tokens.map((token) =>
            token.toJSON()
        );
        // console.log(actualTokens);
        const expectedTokens = [
            { value: "hello", position: { start: 0, end: 5 } },
            { value: " ", position: { start: 5, end: 6 } },
            { value: "world", position: { start: 6, end: 11 } },
            { value: "\r\n", position: { start: 11, end: 13 } },
            { value: "__", position: { start: 13, end: 15 } },
            { value: "\t", position: { start: 15, end: 16 } },
            { value: "HELLO_WORLD", position: { start: 16, end: 27 } },
            { value: "(", position: { start: 27, end: 28 } },
            { value: "test", position: { start: 28, end: 32 } },
            { value: ")", position: { start: 32, end: 33 } },
            { value: "{", position: { start: 33, end: 34 } },
            { value: "brackets", position: { start: 34, end: 42 } },
            { value: "}", position: { start: 42, end: 43 } },
            { value: "[", position: { start: 43, end: 44 } },
            { value: "variants", position: { start: 44, end: 52 } },
            { value: "]", position: { start: 52, end: 53 } },
            { value: "'", position: { start: 53, end: 54 } },
            { value: "single", position: { start: 54, end: 60 } },
            { value: "'", position: { start: 60, end: 61 } },
            { value: "\"", position: { start: 61, end: 62 } },
            { value: "double", position: { start: 62, end: 68 } },
            { value: "\\", position: { start: 68, end: 69 } },
            { value: "\"", position: { start: 69, end: 70 } },
            { value: "\"", position: { start: 70, end: 71 } },
            { value: "`", position: { start: 71, end: 72 } },
            { value: "and", position: { start: 72, end: 75 } },
            { value: " ", position: { start: 75, end: 76 } },
            { value: "that", position: { start: 76, end: 80 } },
            { value: "`", position: { start: 80, end: 81 } },
            { value: "123", position: { start: 81, end: 84 } },
            { value: "\t\t", position: { start: 84, end: 86 } },
            { value: "456", position: { start: 86, end: 89 } },
            { value: "\t", position: { start: 89, end: 90 } },
            { value: "7890", position: { start: 90, end: 94 } },
            { value: "%", position: { start: 94, end: 95 } },
            { value: "+", position: { start: 95, end: 96 } },
            { value: "-", position: { start: 96, end: 97 } },
            { value: "*", position: { start: 97, end: 98 } },
            { value: "/", position: { start: 98, end: 99 } },
            { value: "~", position: { start: 99, end: 100 } },
            { value: "!", position: { start: 100, end: 101 } },
            { value: ".", position: { start: 101, end: 102 } },
            { value: ">", position: { start: 102, end: 103 } },
            { value: "<", position: { start: 103, end: 104 } },
            { value: "=", position: { start: 104, end: 105 } },
            { value: "^", position: { start: 105, end: 106 } },
            { value: "&", position: { start: 106, end: 107 } },
            { value: "&", position: { start: 107, end: 108 } },
            { value: "|", position: { start: 108, end: 109 } },
            { value: "|", position: { start: 109, end: 110 } },
            { value: "?", position: { start: 110, end: 111 } },
            { value: "", position: { start: 111, end: 111 } }
        ];
        assert.deepStrictEqual(
            actualTokens,
            expectedTokens
        );

        assert.ok( tokens[0] instanceof WordToken, "[0] is WordToken" );
        assert.ok( tokens[2] instanceof WordToken, "[2] is WordToken" );
        assert.ok( tokens[4] instanceof WordToken, "[4] is WordToken" );
        assert.ok( tokens[6] instanceof WordToken, "[6] is WordToken" );

        assert.ok( tokens[1] instanceof SpaceToken, "[1] is SpaceToken" );
        assert.ok( tokens[3] instanceof SpaceToken, "[3] is SpaceToken" );
        assert.ok( tokens[5] instanceof SpaceToken, "[5] is SpaceToken" );

        assert.ok( tokens[7] instanceof BracketsToken, "[7] is BracketsToken" );
        assert.ok( tokens[9] instanceof BracketsToken, "[9] is BracketsToken" );
        assert.ok( tokens[10] instanceof BracketsToken, "[10] is BracketsToken" );
        assert.ok( tokens[12] instanceof BracketsToken, "[12] is BracketsToken" );
        assert.ok( tokens[13] instanceof BracketsToken, "[13] is BracketsToken" );
        assert.ok( tokens[15] instanceof BracketsToken, "[15] is BracketsToken" );

        assert.ok( tokens[29] instanceof DigitsToken, "[29] is DigitsToken" );
        assert.ok( tokens[31] instanceof DigitsToken, "[31] is DigitsToken" );
        assert.ok( tokens[33] instanceof DigitsToken, "[33] is DigitsToken" );

        assert.ok( tokens[16] instanceof QuotesToken, "[16] is QuotesToken" );
        assert.ok( tokens[19] instanceof QuotesToken, "[19] is QuotesToken" );
        assert.ok( tokens[24] instanceof QuotesToken, "[24] is QuotesToken" );

        for (let i = 34; i <= 50; i++) {
            assert.ok( tokens[i] instanceof OperatorsToken, `[${i}] is OperatorsToken` );
        }
    });

});