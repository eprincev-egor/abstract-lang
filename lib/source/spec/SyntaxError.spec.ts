import assert from "assert";
import { codeExample } from "../highlighter/spec/fixture";
import { SyntaxError } from "../SyntaxError";
import { Token } from "../../token";
import { TestNode } from "../../node/spec/AbstractNode/fixture";
import { SourceCode } from "../../source/SourceCode";
import { SourceFile } from "../../source/SourceFile";

describe("SyntaxError", () => {

    let source!: SourceCode;
    beforeEach(() => {
        source = new SourceCode({
            text: codeExample
        });
    });

    const message = "unexpected token";

    it("syntax error on line 10", () => {
        const testToken = source.tokens.find((token) =>
            token.value === "skipSpace"
        ) as Token;
        source.cursor.setPositionBefore(testToken);

        const err = SyntaxError.at({source, message});

        assert.deepStrictEqual(err.coords, {
            line: 10,
            column: 10
        });

        assert.ok( err.message.includes(
            "\n> 10 |    this.skipSpace();"
        ) );
    });

    it("syntax error on line 1", () => {
        const testToken = source.tokens.find((token) =>
            token.value === "readWord"
        ) as Token;
        source.cursor.setPositionBefore(testToken);

        const err = SyntaxError.at({source, message});

        assert.deepStrictEqual(err.coords, {
            line: 1,
            column: 1
        });

        assert.ok( err.message.includes(
            "\n> 1 |readWord(): string {"
        ) );
    });

    it("syntax error on line 31", () => {
        const testToken = source.tokens.slice().reverse().find((token) =>
            token.value === "lowerWord"
        ) as Token;
        source.cursor.setPositionBefore(testToken);

        const err = SyntaxError.at({source, message});

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
        const err = SyntaxError.at({source, node, message});

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
            SyntaxError.at({source, node, message});
        }, (err: Error) =>
            /node should have position/.test(err.message)
        );
    });

    it("show filePath:column:line", () => {
        const file = new SourceFile({
            path: "./test.txt",
            text: codeExample
        });
        const testToken = file.tokens.slice().reverse().find((token) =>
            token.value === "lowerWord"
        ) as Token;
        file.cursor.setPositionBefore(testToken);

        const err = SyntaxError.at({
            source: file.cursor.source,
            message
        });

        assert.ok( err.message.includes(
            "./test.txt:31:12"
        ) );
    });

});