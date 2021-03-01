import { WordToken } from "../../token";
import { Cursor } from "../../cursor";
import { AbstractNode, NodeClass } from "../../node";
import { assertNode } from "../assertNode";
import assert from "assert";

describe("assertNode", () => {

    interface WordRow {
        word: string;
    }
    let WordNode!: NodeClass<AbstractNode<WordRow>>;

    beforeEach(() => {
        WordNode = class WordNode extends AbstractNode<WordRow> {

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
        };
    });

    it("invalid json", () => {
        assert.throws(() => {
            assertNode(WordNode, {
                input: "correct",
                json: {
                    word: "wrong"
                },
                pretty: "correct",
                minify: "correct"
            });
        }, (err: Error) =>
            err instanceof assert.AssertionError &&
            JSON.stringify(err.expected) === "{\"word\":\"wrong\"}" &&
            JSON.stringify(err.actual) === "{\"word\":\"correct\"}" &&
            err.message.includes("invalid json on input:\ncorrect\n\n")
        );
    });

    it("invalid pretty", () => {
        assert.throws(() => {
            assertNode(WordNode, {
                input: "correct",
                json: {
                    word: "correct"
                },
                pretty: "wrong",
                minify: "correct"
            });
        }, (err: Error) =>
            err instanceof assert.AssertionError &&
            JSON.stringify(err.expected) === "\"wrong\"" &&
            JSON.stringify(err.actual) === "\"correct\"" &&
            err.message.includes("invalid pretty on input:\ncorrect\n\n")
        );
    });

});