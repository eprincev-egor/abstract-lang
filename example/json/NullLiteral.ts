import { AbstractNode, Cursor } from "abstract-lang";

export class NullLiteral extends AbstractNode {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeValue("null");
    }

    static parse(cursor: Cursor): NullLiteral {
        cursor.readValue("null");
        return new NullLiteral();
    }

    // eslint-disable-next-line class-methods-use-this
    template(): string {
        return "null";
    }
}