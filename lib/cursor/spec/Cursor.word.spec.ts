import assert from "assert";
import { Cursor } from "../Cursor";
import { SourceCode, SyntaxError } from "../../source";

describe("Cursor.word.spec.ts word methods", () => {

    let code!: SourceCode;
    let cursor!: Cursor;
    beforeEach(() => {
        code = new SourceCode({
            text: "hello WORLD"
        });
        cursor = code.cursor;
    });

    describe("beforeWord(word)", () => {

        it("before 'hello'", () => {
            assert.strictEqual(
                cursor.beforeWord("hello"),
                true
            );
            assert.strictEqual(
                cursor.beforeWord("wrong"),
                false
            );
        });

        it("before 'HELLO'", () => {
            // to improve performance,
            // do not convert the input word to lowercase
            assert.strictEqual(
                cursor.beforeWord("HELLO"),
                false
            );
        });

        it("before 'world'", () => {
            cursor.next();
            cursor.next();
            assert.strictEqual(
                cursor.beforeWord("world"),
                true
            );
            assert.strictEqual(
                cursor.beforeWord("wrong"),
                false
            );
        });

    });

    describe("readWord(word)", () => {

        it("read and move", () => {
            assert.strictEqual(
                cursor.readWord("hello"),
                "hello"
            );
            assert.ok(
                cursor.beforeValue("WORLD")
            );
        });

        it("input word in other lower, return original token.value in UPPER case", () => {
            cursor.next();
            cursor.next();
            assert.strictEqual(
                cursor.readWord("world"),
                "WORLD"
            );
        });

        it("throw an error, if next token value is not correct", () => {
            assert.throws(() => {
                cursor.readWord("expected");
            }, (err: Error) =>
                err instanceof SyntaxError &&
                /unexpected token: "hello", expected word: "expected"/.test(err.message)
            );
        });

        it("throw an error if the next token is EOF", () => {
            cursor.next();
            cursor.next();
            cursor.next();

            assert.throws(() => {
                cursor.readWord("missed");
            }, (err: Error) =>
                err instanceof SyntaxError &&
                /reached end of code, but expected word: "missed"/.test(err.message)
            );
        });
    });

    describe("readPhrase(...words)", () => {

        it("read and move", () => {
            assert.deepStrictEqual(
                cursor.readPhrase("hello", "world"),
                ["hello", "WORLD"]
            );
            assert.ok(
                cursor.beforeEnd()
            );
        });

        it("throw an error, if next token value is not correct", () => {
            assert.throws(() => {
                cursor.readPhrase("expected", "phrase");
            }, (err: Error) =>
                err instanceof SyntaxError &&
                /unexpected token: "hello", expected word: "expected"/.test(err.message)
            );
        });

        it("throw an error if the next token is EOF", () => {
            cursor.next();
            cursor.next();

            assert.throws(() => {
                cursor.readPhrase("world", "missed");
            }, (err: Error) =>
                err instanceof SyntaxError &&
                /reached end of code, but expected word: "missed"/.test(err.message)
            );
        });


        it("need skip spaces after phrase", () => {
            assert.deepStrictEqual(
                cursor.readPhrase("hello"),
                ["hello"]
            );
            assert.ok(
                cursor.beforeWord("world")
            );
        });
    });

    describe("beforePhrase(...words)", () => {

        it("before phrase 'hello' 'world'", () => {
            assert.strictEqual(
                cursor.beforePhrase("hello", "world"),
                true
            );
            // don't move position
            assert.ok(
                cursor.beforeWord("hello")
            );
        });

        it("before phrase 'unknown' 'phrase'", () => {
            assert.strictEqual(
                cursor.beforePhrase("unknown", "phrase"),
                false
            );
            // don't move position
            assert.ok(
                cursor.beforeWord("hello")
            );
        });

        it("before phrase 'hello' 'wrong'", () => {
            assert.strictEqual(
                cursor.beforePhrase("hello", "wrong"),
                false
            );
            // don't move position
            assert.ok(
                cursor.beforeWord("hello")
            );
        });

    });

});
