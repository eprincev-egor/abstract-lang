import assert from "assert";
import { Cursor } from "../Cursor";
import { SyntaxError } from "../../source";
import { Hello, World } from "./fixture";
import { TestLang } from "./TestLang";

describe("Cursor.oneOf.spec.ts node *oneOf methods", () => {

    let cursor!: Cursor;
    beforeEach(() => {
        cursor = TestLang.code("hello world").cursor;
    });

    describe("tryParseOneOf(Node[])", () => {

        it("return second", () => {
            const result = cursor.tryParseOneOf([World, Hello]);
            assert.ok(result instanceof Hello);
            assert.strictEqual(result.toString(), "hello");
        });

        it("return first", () => {
            const result = cursor.tryParseOneOf([Hello, World]);
            assert.ok(result instanceof Hello);
            assert.strictEqual(result.toString(), "hello");
        });

        it("return second, after some parsing", () => {
            cursor.readWord("hello");

            const result = cursor.tryParseOneOf([Hello, World]);
            assert.ok(result instanceof World);
            assert.strictEqual(result.toString(), "world");
        });

        it("return undefined", () => {
            cursor.readPhrase("hello", "world");

            const result = cursor.tryParseOneOf([World, Hello]);
            assert.strictEqual(result, undefined);
        });

    });

    describe("parseOneOf(Node[])", () => {

        it("return second", () => {
            const result = cursor.parseOneOf([World, Hello], "some");
            assert.ok(result instanceof Hello);
            assert.strictEqual(result.toString(), "hello");
        });

        it("return first", () => {
            const result = cursor.parseOneOf([Hello, World], "error");
            assert.ok(result instanceof Hello);
            assert.strictEqual(result.toString(), "hello");
        });

        it("throw error", () => {
            cursor.readPhrase("hello", "world");

            assert.throws(() => {
                cursor.parseOneOf([World, Hello], "custom error message");
            }, (err: Error) =>
                /custom error message/.test(err.message) &&
                err instanceof SyntaxError
            );
        });

    });

    describe("beforeOneOf(Node[])", () => {

        it("return true on second", () => {
            const result = cursor.beforeOneOf([World, Hello]);
            assert.strictEqual(result, true);
        });

        it("return true on first", () => {
            const result = cursor.beforeOneOf([Hello, World]);
            assert.strictEqual(result, true);
        });

        it("return false", () => {
            cursor.readPhrase("hello", "world");

            const result = cursor.beforeOneOf([Hello, World]);
            assert.strictEqual(result, false);
        });

    });


});
