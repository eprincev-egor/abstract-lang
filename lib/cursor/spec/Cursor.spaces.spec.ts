import assert from "assert";
import { Cursor } from "../Cursor";
import { AbstractNode } from "../../node";
import { EndOfLineToken } from "../../token";
import { AbstractLang } from "../../lang";

describe("Cursor.other.spec.ts other methods", () => {

    it("usage example: parse single quotes", () => {
        interface InlineCommentRow {
            comment: string;
        }

        class InlineComment extends AbstractNode<InlineCommentRow> {
            static entry(cursor: Cursor) {
                return cursor.beforeSequence("-", "-");
            }

            static parse(cursor: Cursor): InlineCommentRow {
                cursor.readValue("-");
                cursor.readValue("-");

                let comment = "";
                while ( !cursor.beforeEnd() && !cursor.beforeToken(EndOfLineToken) ) {
                    comment += cursor.readAnyOne().value;
                }

                return {comment};
            }

            // istanbul ignore next
            template(): string {
                return "--" + this.row.comment;
            }
        }

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
