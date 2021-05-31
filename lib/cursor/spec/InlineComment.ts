import { Cursor } from "../Cursor";
import { AbstractNode } from "../../node";
import { EndOfLineToken } from "../../token";

interface InlineCommentRow {
    comment: string;
}

export class InlineComment extends AbstractNode<InlineCommentRow> {

    static entry(cursor: Cursor): boolean {
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
