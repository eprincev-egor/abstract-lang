import assert from "assert";
import { Cursor } from "../Cursor";
import { SourceFile, SyntaxError } from "../../source";
import {
    Token,
    SpaceToken,
    WordToken
} from "../../token";

describe("Cursor.base.spec.ts base methods", () => {

    let file!: SourceFile;
    let cursor!: Cursor;
    beforeEach(() => {
        file = new SourceFile({
            path: "test.txt",
            content: "hello world"
        });
        cursor = file.cursor;
    });

    it("required not empty array of tokens", () => {
        assert.throws(() => {
            new Cursor({tokens: []} as any);
        }, (err: Error) =>
            /required not empty array of tokens/.test(err.message)
        );
    });

    it("required EOF at last token", () => {
        assert.throws(() => {
            new Cursor({tokens: [
                new Token("test", 0)
            ]} as any);
        }, (err: Error) =>
            /required special token EOF after last token/.test(err.message)
        );
    });

    it("beforeValue('hello')", () => {
        assert.ok( cursor.beforeValue("hello") );
        assert.ok( !cursor.beforeValue("world") );
    });

    it("beforeEnd()", () => {
        cursor.next();
        assert.ok( !cursor.beforeEnd() );

        cursor.next();
        cursor.next();
        assert.ok( cursor.beforeEnd() );
    });

    it("valid cursor.nextToken property", () => {
        assert.ok( cursor.nextToken instanceof WordToken );
        assert.strictEqual( cursor.nextToken.value, "hello" );
        cursor.next();

        assert.ok( cursor.nextToken instanceof SpaceToken );
        assert.strictEqual( cursor.nextToken.value, " " );
        cursor.next();

        assert.ok( cursor.nextToken instanceof WordToken );
        assert.strictEqual( cursor.nextToken.value, "world" );
    });

    it("throwError(message) => SyntaxError", () => {
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
        assert.strictEqual( actualError.target, cursor.nextToken, "valid token" );
    });

    describe("readValue(value)", () => {

        it("read and move", () => {
            const result = cursor.readValue("hello");
            assert.strictEqual( result, "hello" );
            assert.ok( cursor.beforeValue(" ") );
        });

        it("throw an error if the next token has a different value", () => {
            assert.throws(() => {
                cursor.readValue("world");
            }, (err: Error) =>
                err instanceof SyntaxError &&
                /unexpected token: "hello", expected: "world"/.test(err.message)
            );
        });

        it("throw an error if the next token is EOF", () => {
            cursor.next();
            cursor.next();
            cursor.next();

            assert.throws(() => {
                cursor.readValue("missed");
            }, (err: Error) =>
                err instanceof SyntaxError &&
                /reached end of code, but expected token: "missed"/.test(err.message)
            );
        });
    });

    describe("next()", () => {

        it("cannot move position after last token", () => {
            cursor.next();
            cursor.next();
            cursor.next();

            assert.throws(() => {
                cursor.next();
            }, (err: Error) =>
                err instanceof SyntaxError &&
                /reached end of tokens/.test(err.message)
            );
        });

        it("move cursor on one token", () => {
            cursor.next();
            assert.ok( cursor.beforeValue(" "), "now before space" );

            cursor.next();
            assert.ok( cursor.beforeValue("world"), "now before world" );
        });

    });

    describe("setPositionBefore(Token)", () => {

        it("set position before world", () => {
            const hello = file.tokens[0];
            const world = file.tokens[2];

            cursor.setPositionBefore(world);
            assert.ok(
                cursor.beforeValue("world"),
                "set position before world, now before world"
            );

            cursor.setPositionBefore(hello);
            assert.ok(
                cursor.beforeValue("hello"),
                "set position before hello, now before hello"
            );
        });

        it("set position before unknown token", () => {
            const unknownToken = new Token("test", 999);
            assert.throws(() => {
                cursor.setPositionBefore(unknownToken);
            }, (err: Error) =>
                /cannot set position before unknown token: "test"/.test(err.message)
            );

            assert.strictEqual(cursor.nextToken.value, "hello");
        });

        it("next(); setPositionBefore(); read();", () => {
            cursor.next();
            cursor.next();
            cursor.next();
            cursor.setPositionBefore(file.tokens[0]);

            const word = cursor.read(WordToken);
            assert.strictEqual(word.value, "hello");

            const spaces = cursor.read(SpaceToken);
            assert.strictEqual(spaces.value, " ");
        });
    });

});
