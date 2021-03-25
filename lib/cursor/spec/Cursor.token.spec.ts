import assert from "assert";
import { Cursor } from "../Cursor";
import { SourceCode, SyntaxError } from "../../source";
import {
    SpaceToken,
    WordToken,
    EndOfFleToken,
    EndOfLineToken
} from "../../token";

describe("Cursor.token.spec.ts token methods", () => {

    let code!: SourceCode;
    let cursor!: Cursor;
    beforeEach(() => {
        code = new SourceCode({
            text: "hello world"
        });
        cursor = code.cursor;
    });

    it("beforeToken(TokenClass)", () => {
        assert.ok( cursor.beforeToken(WordToken) );
        assert.ok( !cursor.beforeToken(SpaceToken) );
    });

    describe("read(Token)", () => {

        it("testing returns value", () => {
            const hello = cursor.read(WordToken).value;
            assert.strictEqual( hello, "hello" );

            const space = cursor.read(SpaceToken).value;
            assert.strictEqual( space, " " );

            const world = cursor.read(WordToken).value;
            assert.strictEqual( world, "world" );
        });

        it("throw an error if the next token has a different class", () => {
            assert.throws(() => {
                cursor.read(SpaceToken);
            }, (err: Error) =>
                err instanceof SyntaxError &&
                /unexpected token WordToken\("hello"\), expected: SpaceToken/.test(err.message)
            );
        });

        it("throw an error if the next token is EOF", () => {
            cursor.next();
            cursor.next();
            cursor.next();

            assert.throws(() => {
                cursor.read(WordToken);
            }, (err: Error) =>
                err instanceof SyntaxError &&
                /reached end of code, but expected token: WordToken/.test(err.message)
            );
        });

    });

    describe("skipOne(TokenClass)", () => {

        it("skip only one token with same class", () => {
            cursor = new Cursor({tokens: [
                new SpaceToken(" ", 0),
                new SpaceToken(" ", 1),
                new WordToken("correct", 2),
                new EndOfFleToken(9)
            ]} as any);

            cursor.skipOne(SpaceToken);
            assert.ok( cursor.beforeValue(" "), "skipped one token" );
        });

        it("don't change position if the next token has a different class", () => {
            cursor.skipOne(SpaceToken);
            assert.ok( cursor.beforeValue("hello") );
        });

        it("skip any one", () => {
            cursor.skipOne();
            assert.ok( cursor.beforeValue(" ") );
        });
    });

    describe("skipAll(TokenClass, ...)", () => {

        it("skip all tokens with same class", () => {
            cursor = new Cursor({tokens: [
                new SpaceToken(" ", 0),
                new SpaceToken(" ", 1),
                new WordToken("correct", 2),
                new EndOfFleToken(9)
            ]} as any);

            cursor.skipAll(SpaceToken);
            assert.ok( cursor.beforeValue("correct"), "before correct token" );
        });

        it("don't change position if the next token has a different class", () => {
            cursor = new Cursor({tokens: [
                new SpaceToken(" ", 0),
                new EndOfLineToken("\r", 1),
                new SpaceToken(" ", 2),
                new EndOfLineToken("\n", 3),
                new WordToken("correct", 4),
                new EndOfFleToken(11)
            ]} as any);

            cursor.skipAll(WordToken);
            assert.ok( cursor.beforeValue(" ") );
        });

        it("skip all tokens with same classes", () => {
            cursor = new Cursor({tokens: [
                new SpaceToken(" ", 0),
                new EndOfLineToken("\r", 1),
                new SpaceToken(" ", 2),
                new EndOfLineToken("\n", 3),
                new WordToken("correct", 4),
                new EndOfFleToken(11)
            ]} as any);

            cursor.skipAll(SpaceToken, EndOfLineToken);
            assert.ok( cursor.beforeValue("correct"), "before correct token" );
        });

    });

});
