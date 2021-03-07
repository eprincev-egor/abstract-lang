import assert from "assert";
import { codeExample } from "./fixture";
import { SourceCode } from "../../SourceCode";
import { NodeHighlighter } from "../NodeHighlighter";
import {
    Token, Tokenizer,
    defaultMap
} from "../../../token";

describe("NodeHighlighter", () => {

    let tokens!: readonly Token[];
    let code!: SourceCode;
    beforeEach(() => {
        tokens = Tokenizer.tokenize(
            defaultMap,
            codeExample
        );
        code = SourceCode.fromTokens(tokens);
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

});