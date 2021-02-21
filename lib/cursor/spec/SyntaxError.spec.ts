import * as assert from "assert";
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
    let tokens!: Token[];
    let cursor!: Cursor;
    beforeEach(() => {
        tokens = Tokenizer.tokenize(
            defaultMap,
            codeExample
        );
        cursor = new Cursor(tokens);
    });

    it("show 4 lines before invalid token and 4 lines after", () => {
        const testToken = tokens.find((token) =>
            token.value === "skipSpace"
        ) as Token;
        cursor.setPositionBefore(testToken);

        const err = SyntaxError.at(cursor, "unexpected token");

        assert.strictEqual(err.line, 10, "valid line");
        assert.strictEqual(err.column, 14, "valid column");

        assert.strictEqual(
            err.message,
            "SyntaxError: unexpected token" +
            "\nline 10, column 14" +
            "\n" +
            "\n  ...|" +
            "\n   6 |            this.i = this.lastWordEndIndex!;" +
            "\n   7 |            return this.lastWord!;" +
            "\n   8 |        }" +
            "\n   9 |" +
            "\n> 10 |         this.skipSpace();" +
            "\n                    ^^^^^^^^^" +
            "\n  11 |" +
            "\n  12 |        for (; this.i < this.n; this.i++) {" +
            "\n  13 |            const symbol = this.str[ this.i ];" +
            "\n  14 |" +
            "\n  ...|"
        );
    });
});