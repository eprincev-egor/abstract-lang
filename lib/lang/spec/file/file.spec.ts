import assert from "assert";
import { InlineComment } from "../../../cursor/spec/InlineComment";
import { SourceFile } from "source";
import { AbstractLang } from "../../AbstractLang";

describe("Lang.file(filePath)", () => {

    class TestLang extends AbstractLang {
        static Comments = [InlineComment];
    }

    it("success read file", () => {
        const filePath = __dirname + "/hello.txt";
        const test = TestLang.file(filePath);
        assert.ok( test.source instanceof SourceFile );
        assert.strictEqual( test.source.path, filePath );
    });

    it("failed read file", () => {
        assert.throws(() => {
            TestLang.file("invalid file path");
        }, (err: Error) =>
            /no such file or directory, open 'invalid file path'/.test(err.message)
        );
    });

    it("valid cursor spaces config (skip comments)", () => {
        const filePath = __dirname + "/commented.txt";
        const test = TestLang.file(filePath);

        test.cursor.skipSpaces();
        assert.ok( test.cursor.beforeValue("hello") );
    });

});