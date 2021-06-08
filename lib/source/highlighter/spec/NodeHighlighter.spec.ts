import assert from "assert";
import { codeExample } from "./fixture";
import { NodeHighlighter } from "../NodeHighlighter";
import { TestLang } from "../../../cursor/spec/TestLang";
import { Source } from "../../interface";

describe("NodeHighlighter", () => {

    let code!: Source;
    beforeEach(() => {
        code = TestLang.code(codeExample).source;
    });

    it("show 4 lines before invalid node and 4 lines after", () => {
        assert.strictEqual(
            NodeHighlighter.highlight(code, {
                position: {
                    start: 318,
                    end: 376
                }
            }),

            "\n  ...|" +
            "\n  11 |" +
            "\n  12 |    for (; this.i < this.n; this.i++) {" +
            "\n  13 |        const symbol = this.str[ this.i ];" +
            "\n  14 |" +
            "\n> 15 |        if ( /[^\\w]/.test(symbol) ) {" +
            "\n> 16 |            break;" +
            "\n> 17 |        }" +
            "\n  18 |" +
            "\n  19 |        word += symbol;" +
            "\n  20 |    }" +
            "\n  21 |" +
            "\n  ...|"
        );
    });

    it("single line node", () => {
        assert.strictEqual(
            NodeHighlighter.highlight(code, {
                position: {
                    start: 274,
                    end: 307
                }
            }),

            "\n  ...|" +
            "\n   9 |" +
            "\n  10 |    this.skipSpace();" +
            "\n  11 |" +
            "\n  12 |    for (; this.i < this.n; this.i++) {" +
            "\n> 13 |        const symbol = this.str[ this.i ];" +
            "\n              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^" +
            "\n  14 |" +
            "\n  15 |        if ( /[^\\w]/.test(symbol) ) {" +
            "\n  16 |            break;" +
            "\n  17 |        }" +
            "\n  ...|"
        );
    });

    it("show 4 lines after invalid node at first two lines", () => {
        assert.strictEqual(
            NodeHighlighter.highlight(code, {
                position: {
                    start: 0,
                    end: 23
                }
            }),

            "\n>  1 |readWord(): string {" +
            "\n>  2 |    let word = \"\";" +
            "\n   3 |" +
            "\n   4 |    const startIndex = this.i;" +
            "\n   5 |    if ( startIndex === this.lastWordStartIndex ) {" +
            "\n   6 |        this.i = this.lastWordEndIndex!;" +
            "\n  ...|"
        );
    });

});