import assert from "assert";
import { codeExample } from "../highlighter/spec/fixture";
import { Cursor } from "../../cursor/Cursor";
import { SyntaxError } from "../SyntaxError";
import {
    Token, Tokenizer,
    defaultMap
} from "../../token";
import { TestNode } from "../../node/spec/AbstractNode/fixture";

describe("SyntaxError", () => {
    let tokens!: readonly Token[];
    let cursor!: Cursor;
    beforeEach(() => {
        tokens = Tokenizer.tokenize(
            defaultMap,
            codeExample
        );
        cursor = new Cursor(tokens);
    });

    const message = "unexpected token";

    it("syntax error on line 10", () => {
        const testToken = tokens.find((token) =>
            token.value === "skipSpace"
        ) as Token;
        cursor.setPositionBefore(testToken);

        const err = SyntaxError.at({cursor, message});

        assert.deepStrictEqual(err.coords, {
            line: 10,
            column: 10
        });

        assert.ok( err.message.includes(
            "\n> 10 |    this.skipSpace();"
        ) );
    });

    it("syntax error on line 1", () => {
        const testToken = tokens.find((token) =>
            token.value === "readWord"
        ) as Token;
        cursor.setPositionBefore(testToken);

        const err = SyntaxError.at({cursor, message});

        assert.deepStrictEqual(err.coords, {
            line: 1,
            column: 1
        });

        assert.ok( err.message.includes(
            "\n> 1 |readWord(): string {"
        ) );
    });

    it("syntax error on line 31", () => {
        const testToken = tokens.slice().reverse().find((token) =>
            token.value === "lowerWord"
        ) as Token;
        cursor.setPositionBefore(testToken);

        const err = SyntaxError.at({cursor, message});

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
        const err = SyntaxError.at({cursor, node, message});

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
            SyntaxError.at({cursor, node, message});
        }, (err: Error) =>
            /node should have position/.test(err.message)
        );
    });

});