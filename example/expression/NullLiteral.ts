import { AbstractNode, Cursor } from "abstract-lang";

export interface NullRow {
    null: true;
}

export class NullLiteral extends AbstractNode<NullRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeValue("null");
    }

    static parse(cursor: Cursor): NullRow {
        cursor.readValue("null");
        return {null: true};
    }

    // eslint-disable-next-line class-methods-use-this
    template(): string {
        return "null";
    }
}