import { WordToken } from "../../token";
import { Cursor } from "../../cursor";
import { AbstractNode } from "../../node";
import { assertNode } from "../assertNode";

describe("assertNode", () => {

    it("valid node", () => {
        interface WordRow {
            word: string;
        }

        class WordNode extends AbstractNode<WordRow> {

            static entry(cursor: Cursor) {
                return cursor.beforeToken(WordToken);
            }

            static parse(cursor: Cursor): WordRow {
                const word = cursor.read(WordToken).value;
                return {word};
            }

            template() {
                return this.row.word;
            }
        }

        assertNode(WordNode, {
            input: "hello",
            json: {
                word: "hello"
            },
            pretty: "hello",
            minify: "hello"
        });
    });

});