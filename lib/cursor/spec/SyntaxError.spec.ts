import assert from "assert";
import { Cursor } from "../Cursor";
import { SyntaxError } from "../SyntaxError";
import {
    Token, Tokenizer,
    defaultMap
} from "../../token";

describe("SyntaxError", () => {
    const codeExample = `    readWord(): string {
        let word = "";

        const startIndex = this.i;
        if ( startIndex === this.lastWordStartIndex ) {
            this.i = this.lastWordEndIndex!;
            return this.lastWord!;
        }

        this.skipSpace();

        for (; this.i < this.n; this.i++) {
            const symbol = this.str[ this.i ];

            if ( /[^\\w]/.test(symbol) ) {
                break;
            }

            word += symbol;
        }

        this.skipSpace();

        const endIndex = this.i;
        const lowerWord = word.toLowerCase();
        
        this.lastWordStartIndex = startIndex;
        this.lastWordEndIndex = endIndex;
        this.lastWord = lowerWord;

        return lowerWord;
    }`;
    let tokens!: readonly Token[];
    let cursor!: Cursor;
    beforeEach(() => {
        tokens = Tokenizer.tokenize(
            defaultMap,
            codeExample
        );
        cursor = new Cursor(tokens);
    });

    const testErrorMessage = "unexpected token";
    const shouldBeMessage = "SyntaxError: unexpected token";

    it("show 4 lines before invalid token and 4 lines after", () => {
        const testToken = tokens.find((token) =>
            token.value === "skipSpace"
        ) as Token;
        cursor.setPositionBefore(testToken);

        const err = SyntaxError.at(cursor, testErrorMessage);

        assert.deepStrictEqual(err.coords, {
            line: 10,
            column: 14
        });

        assert.strictEqual(
            err.message,
            shouldBeMessage +
            "\nline 10, column 14" +
            "\n" +
            "\n  ...|" +
            "\n   6 |            this.i = this.lastWordEndIndex!;" +
            "\n   7 |            return this.lastWord!;" +
            "\n   8 |        }" +
            "\n   9 |" +
            "\n> 10 |        this.skipSpace();" +
            "\n                   ^^^^^^^^^" +
            "\n  11 |" +
            "\n  12 |        for (; this.i < this.n; this.i++) {" +
            "\n  13 |            const symbol = this.str[ this.i ];" +
            "\n  14 |" +
            "\n  ...|"
        );
    });

    it("show code fragment with target on first line", () => {
        const testToken = tokens.find((token) =>
            token.value === "readWord"
        ) as Token;
        cursor.setPositionBefore(testToken);

        const err = SyntaxError.at(cursor, testErrorMessage);

        assert.deepStrictEqual(err.coords, {
            line: 1,
            column: 5
        });

        assert.strictEqual(
            err.message,
            shouldBeMessage +
            "\nline 1, column 5" +
            "\n" +
            "\n> 1 |    readWord(): string {" +
            "\n         ^^^^^^^^" +
            "\n  2 |        let word = \"\";" +
            "\n  3 |" +
            "\n  4 |        const startIndex = this.i;" +
            "\n  5 |        if ( startIndex === this.lastWordStartIndex ) {" +
            "\n  ...|"
        );
    });

    it("show code fragment with target before last line", () => {
        const testToken = tokens.slice().reverse().find((token) =>
            token.value === "lowerWord"
        ) as Token;
        cursor.setPositionBefore(testToken);

        const err = SyntaxError.at(cursor, testErrorMessage);

        assert.deepStrictEqual(err.coords, {
            line: 31,
            column: 16
        });

        assert.strictEqual(
            err.message,
            shouldBeMessage +
            "\nline 31, column 16" +
            "\n" +
            "\n  ...|" +
            "\n  27 |        this.lastWordStartIndex = startIndex;" +
            "\n  28 |        this.lastWordEndIndex = endIndex;" +
            "\n  29 |        this.lastWord = lowerWord;" +
            "\n  30 |" +
            "\n> 31 |        return lowerWord;" +
            "\n                     ^^^^^^^^^" +
            "\n  32 |    }"
        );
    });
});