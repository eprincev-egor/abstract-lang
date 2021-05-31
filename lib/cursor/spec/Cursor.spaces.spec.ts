import assert from "assert";
import { AbstractLang } from "../../lang";
import { InlineComment } from "./InlineComment";

describe("Cursor.other.spec.ts other methods", () => {

    it("usage example: parse single quotes", () => {

        class TestLang extends AbstractLang {
            static Comments = [InlineComment]
        }

        const {cursor} = TestLang.code(`
            -- comment 1
            -- comment 2
            hello
        `);

        cursor.skipSpaces();
        assert.ok( cursor.beforeValue("hello") );

    });

});
