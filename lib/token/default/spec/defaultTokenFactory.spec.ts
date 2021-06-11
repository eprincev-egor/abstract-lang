import assert from "assert";
import { Tokenizer } from "../../Tokenizer";
import { BracketsToken } from "../BracketsToken";
import { defaultTokenFactory } from "../defaultTokenFactory";
import { DigitsToken } from "../DigitsToken";
import { EndOfLineToken } from "../EndOfLineToken";
import { OperatorsToken } from "../OperatorsToken";
import { QuotesToken } from "../QuotesToken";
import { SpaceToken } from "../SpaceToken";
import { WordToken } from "../WordToken";

describe("defaultTokenFactory", () => {

    it("all variants of tokens", () => {
        const tokens = Tokenizer.tokenize(
            defaultTokenFactory,
            [
                "hello world\r\n__\tHELLO_WORLD",
                "(test){brackets}[variants]",
                "'single'\"double\\\"\"`and that`",
                "123\t\t456\t7890",
                "%+-*/~!.><=^&&||?@",
                "10e10"
            ].join("")
        );

        const actualTokens = tokens.map((token) =>
            token.toJSON()
        );
        // console.log(actualTokens);
        const expectedTokens = [
            { value: "hello", position: 0 },
            { value: " ", position: 5 },
            { value: "world", position: 6 },
            { value: "\r\n", position: 11 },
            { value: "__", position: 13 },
            { value: "\t", position: 15 },
            { value: "HELLO_WORLD", position: 16 },
            { value: "(", position: 27 },
            { value: "test", position: 28 },
            { value: ")", position: 32 },
            { value: "{", position: 33 },
            { value: "brackets", position: 34 },
            { value: "}", position: 42 },
            { value: "[", position: 43 },
            { value: "variants", position: 44 },
            { value: "]", position: 52 },
            { value: "'", position: 53 },
            { value: "single", position: 54 },
            { value: "'", position: 60 },
            { value: "\"", position: 61 },
            { value: "double", position: 62 },
            { value: "\\", position: 68 },
            { value: "\"", position: 69 },
            { value: "\"", position: 70 },
            { value: "`", position: 71 },
            { value: "and", position: 72 },
            { value: " ", position: 75 },
            { value: "that", position: 76 },
            { value: "`", position: 80 },
            { value: "123", position: 81 },
            { value: "\t\t", position: 84 },
            { value: "456", position: 86 },
            { value: "\t", position: 89 },
            { value: "7890", position: 90 },
            { value: "%", position: 94 },
            { value: "+", position: 95 },
            { value: "-", position: 96 },
            { value: "*", position: 97 },
            { value: "/", position: 98 },
            { value: "~", position: 99 },
            { value: "!", position: 100 },
            { value: ".", position: 101 },
            { value: ">", position: 102 },
            { value: "<", position: 103 },
            { value: "=", position: 104 },
            { value: "^", position: 105 },
            { value: "&", position: 106 },
            { value: "&", position: 107 },
            { value: "|", position: 108 },
            { value: "|", position: 109 },
            { value: "?", position: 110 },
            { value: "@", position: 111 },

            // WordToken does not include digits
            { value: "10", position: 112 },
            { value: "e", position: 114 },
            { value: "10", position: 115 },

            { value: "", position: 117 }
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
        assert.ok( tokens[5] instanceof SpaceToken, "[5] is SpaceToken" );
        assert.ok( tokens[26] instanceof SpaceToken, "[26] is SpaceToken" );

        assert.ok( tokens[3] instanceof EndOfLineToken, "[3] is EolToken" );

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

        for (let i = 34; i <= 51; i++) {
            assert.ok( tokens[i] instanceof OperatorsToken, `[${i}] is OperatorsToken` );
        }
    });

    it("BOM is SpaceToken", () => {
        const BOM = String.fromCharCode(65279);

        const tokens = Tokenizer.tokenize(
            defaultTokenFactory,
            `${BOM} test`
        );

        const actualTokens = tokens.map((token) =>
            token.toJSON()
        );
        assert.deepStrictEqual(
            actualTokens, [
                {value: `${BOM} `, position: 0},
                {value: "test", position: 2},
                {value: "", position: 6}
            ]
        );
        assert.ok( tokens[0] instanceof SpaceToken );
    });

});