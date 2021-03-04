import assert from "assert";
import { codeExample } from "./fixture";
import { Cursor } from "../../cursor/Cursor";
import { SourceCode } from "../SourceCode";
import { Highlighter } from "../Highlighter";
import {
    Token, Tokenizer,
    defaultMap
} from "../../token";

describe("Highlighter", () => {

    let tokens!: readonly Token[];
    let cursor!: Cursor;
    let code!: SourceCode;
    beforeEach(() => {
        tokens = Tokenizer.tokenize(
            defaultMap,
            codeExample
        );
        cursor = new Cursor(tokens);
        code = SourceCode.fromTokens(tokens);
    });

    describe("highlightToken(code, token)", () => {

        it("show 4 lines before invalid token and 4 lines after", () => {
            const testToken = tokens.find((token) =>
                token.value === "skipSpace"
            ) as Token;
            cursor.setPositionBefore(testToken);

            assert.strictEqual(
                Highlighter.highlightToken(code, testToken),

                "\n  ...|" +
                "\n   6 |        this.i = this.lastWordEndIndex!;" +
                "\n   7 |        return this.lastWord!;" +
                "\n   8 |    }" +
                "\n   9 |" +
                "\n> 10 |    this.skipSpace();" +
                "\n               ^^^^^^^^^" +
                "\n  11 |" +
                "\n  12 |    for (; this.i < this.n; this.i++) {" +
                "\n  13 |        const symbol = this.str[ this.i ];" +
                "\n  14 |" +
                "\n  ...|"
            );
        });

        it("show code fragment with target on first line", () => {
            const testToken = tokens.find((token) =>
                token.value === "readWord"
            ) as Token;
            cursor.setPositionBefore(testToken);


            assert.strictEqual(
                Highlighter.highlightToken(code, testToken),

                "\n> 1 |readWord(): string {" +
                "\n     ^^^^^^^^" +
                "\n  2 |    let word = \"\";" +
                "\n  3 |" +
                "\n  4 |    const startIndex = this.i;" +
                "\n  5 |    if ( startIndex === this.lastWordStartIndex ) {" +
                "\n  ...|"
            );
        });

        it("show code fragment with target before last line", () => {
            const testToken = tokens.slice().reverse().find((token) =>
                token.value === "lowerWord"
            ) as Token;
            cursor.setPositionBefore(testToken);

            assert.strictEqual(
                Highlighter.highlightToken(code, testToken),

                "\n  ...|" +
                "\n  27 |    this.lastWordStartIndex = startIndex;" +
                "\n  28 |    this.lastWordEndIndex = endIndex;" +
                "\n  29 |    this.lastWord = lowerWord;" +
                "\n  30 |" +
                "\n> 31 |    return lowerWord;" +
                "\n                 ^^^^^^^^^" +
                "\n  32 |}"
            );
        });

    });

});