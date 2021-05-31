import assert from "assert";
import { Cursor } from "../Cursor";
import { SyntaxError } from "../../source";
import {
    SpaceToken,
    WordToken,
    EndOfFleToken,
    EndOfLineToken,
    OperatorsToken
} from "../../token";
import { TestLang } from "./TestLang";

describe("Cursor.token.spec.ts token methods", () => {

    let cursor!: Cursor;
    beforeEach(() => {
        cursor = TestLang.code("hello world").cursor;
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

    describe("skipSpaces()", () => {

        it("don't move position, if no spaces ahead", () => {
            cursor.skipSpaces();
            assert.ok( cursor.beforeValue("hello") );
        });

        it("skip all SpaceToken or EndOfLineTokens", () => {
            cursor = new Cursor({tokens: [
                new SpaceToken(" ", 0),
                new EndOfLineToken("\r", 1),
                new SpaceToken(" ", 2),
                new EndOfLineToken("\n", 3),
                new WordToken("correct", 4),
                new EndOfFleToken(11)
            ]} as any);

            cursor.skipSpaces();
            assert.ok( cursor.beforeValue("correct"), "position is moved" );
        });

    });

    describe("readAnyOne()", () => {

        it("return any one and move position", () => {
            const hello = cursor.readAnyOne().value;
            assert.strictEqual( hello, "hello" );

            const space = cursor.readAnyOne().value;
            assert.strictEqual( space, " " );

            const world = cursor.readAnyOne().value;
            assert.strictEqual( world, "world" );
        });

        it("throw an error if the next token is EOF", () => {
            cursor.next();
            cursor.next();
            cursor.next();

            assert.throws(() => {
                cursor.readAnyOne();
            }, (err: Error) =>
                err instanceof SyntaxError &&
                /reached end of code, but expected any token/.test(err.message)
            );
        });

    });

    describe("readAll(TokenClass, ...)", () => {

        it("returns one token", () => {
            const result = cursor.readAll(WordToken);
            assert.strictEqual( result.length, 1 );
            assert.strictEqual( result[0].value, "hello" );
            assert.ok( cursor.beforeValue(" "), "correct position after readAll()" );
        });

        it("returns sequence of tokens", () => {
            cursor = new Cursor({tokens: [
                new OperatorsToken("+", 0),
                new OperatorsToken("-", 1),
                new OperatorsToken("+", 2),
                new SpaceToken(" ", 3),
                new EndOfFleToken(4)
            ]} as any);

            const result = cursor.readAll(OperatorsToken);
            assert.strictEqual( result.length, 3 );
            assert.strictEqual( result.map((token) => token.value).join(""), "+-+" );
            assert.ok( cursor.beforeValue(" "), "correct position after readAll()" );
        });

        it("returns all of all expected classes", () => {
            cursor = new Cursor({tokens: [
                new OperatorsToken("+", 0),
                new OperatorsToken("x", 1),
                new OperatorsToken("-", 2),
                new OperatorsToken("y", 1),
                new SpaceToken(" ", 3),
                new EndOfFleToken(4)
            ]} as any);

            const result = cursor.readAll(OperatorsToken, WordToken);
            assert.strictEqual( result.length, 4 );
            assert.strictEqual( result.map((token) => token.value).join(""), "+x-y" );
            assert.ok(
                cursor.beforeValue(" "),
                "correct position after readAll(OperatorsToken, WordToken)"
            );
        });

        it("returns empty array if the next token is not correct instance", () => {
            const result = cursor.readAll(OperatorsToken, SpaceToken);
            assert.deepStrictEqual(result, []);
        });

        it("returns empty array if the next token is EOF, expected one of ...", () => {
            cursor.next();
            cursor.next();
            cursor.next();

            const result = cursor.readAll(WordToken, SpaceToken);
            assert.deepStrictEqual(result, []);
        });

    });

});
