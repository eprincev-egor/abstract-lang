import assert from "assert";
import { codeExample } from "../highlighter/spec/fixture";
import { SyntaxError } from "../SyntaxError";
import { Token } from "../../token";
import { TestNode } from "../../node/spec/AbstractNode/fixture";
import { Source } from "../../source/interface";
import { SourceFile } from "../../source/SourceFile";
import { AbstractLang } from "../../lang";

describe("SyntaxError", () => {

    class TestLang extends AbstractLang {}

    let source!: Source;
    beforeEach(() => {
        source = TestLang.code(codeExample).source;
    });

    const message = "unexpected token";

    it("syntax error on line 10", () => {
        const err = SyntaxError.at({
            source, message,
            target: source.tokens.find((token) =>
                token.value === "skipSpace"
            ) as Token
        });

        assert.deepStrictEqual(err.coords, {
            line: 10,
            column: 10
        });

        assert.ok( err.message.includes(
            "\n> 10 |    this.skipSpace();"
        ) );
    });

    it("syntax error on line 1", () => {
        const err = SyntaxError.at({
            source, message,
            target: source.tokens.find((token) =>
                token.value === "readWord"
            ) as Token
        });

        assert.deepStrictEqual(err.coords, {
            line: 1,
            column: 1
        });

        assert.ok( err.message.includes(
            "\n> 1 |readWord(): string {"
        ) );
    });

    it("syntax error on line 31", () => {
        const err = SyntaxError.at({
            source, message,
            target: source.tokens.slice().reverse().find((token) =>
                token.value === "lowerWord"
            ) as Token
        });

        assert.deepStrictEqual(err.coords, {
            line: 31,
            column: 12
        });

        assert.ok( err.message.includes(
            "\n> 31 |    return lowerWord;"
        ) );
    });

    it("syntax error at node", () => {
        const node = new TestNode({
            row: {},
            position: {
                start: 274,
                end: 307
            }
        });
        const err = SyntaxError.at({source, target: node, message});

        assert.deepStrictEqual(err.coords, {
            line: 13,
            column: 9
        });

        assert.ok( err.message.includes(
            "\n> 13 |        const symbol = this.str[ this.i ];" +
            "\n              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"
        ));
    });

    it("syntax error at node without position", () => {
        const node = new TestNode({
            row: {}
        });

        assert.throws(() => {
            SyntaxError.at({source, target: node, message});
        }, (err: Error) =>
            /node should have position/.test(err.message)
        );
    });

    it("show filePath:column:line", () => {
        const tokens = TestLang.code(codeExample).source.tokens;
        const file = new SourceFile(
            "./test.txt",
            tokens
        );

        const err = SyntaxError.at({
            source: file,
            message,
            target: file.tokens.slice().reverse().find((token) =>
                token.value === "lowerWord"
            ) as Token
        });

        assert.ok( err.message.includes(
            "./test.txt:31:12"
        ) );
    });

});