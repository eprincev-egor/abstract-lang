import assert from "assert";
import { Cursor } from "../Cursor";
import { SyntaxError } from "../../source";
import { WordToken } from "../../token";
import { AbstractNode } from "../../node";
import { TestLang } from "./TestLang";

describe("Cursor.throwError.spec.ts", () => {

    let cursor!: Cursor;
    beforeEach(() => {
        cursor = TestLang.code("hello world").cursor;
    });


    describe("throwError(message, target?)", () => {

        it("throw SyntaxError", () => {
            cursor.read(WordToken);

            let actualError: unknown = new Error("expected error");
            try {
                cursor.throwError("test");
            }
            catch (error) {
                actualError = error;
            }

            assert.ok( actualError instanceof SyntaxError );
            assert.strictEqual( actualError.coords.line, 1, "valid line" );
            assert.strictEqual( actualError.coords.column, 6, "valid column" );
            assert.strictEqual( actualError.target, cursor.nextToken, "valid default target" );
        });

        it("error contains custom message", () => {
            assert.throws(() => {
                cursor.throwError("some custom message");
            }, (err: Error) =>
                err.message.includes("some custom message")
            );
        });

        it("target token", () => {
            const target = cursor.source.tokens[2];
            assert.throws(() => {
                cursor.throwError("message", target);
            }, (err: SyntaxError) =>
                err.target === target
            );
        });

        it("target node", () => {
            const helloToken = cursor.source.tokens[2];
            const worldToken = cursor.source.tokens[2];
            const node = Object.create(AbstractNode.prototype) as AbstractNode<any>;
            (node as any).position = {
                start: helloToken.position,
                end: worldToken.position
            };

            assert.throws(() => {
                cursor.throwError("message", node);
            }, (err: SyntaxError) =>
                err.target === node
            );
        });

    });

});
