import { AbstractSyntax, Cursor } from "../../index";

export class NullLiteral extends AbstractSyntax {

    static parse(cursor: Cursor): NullLiteral {
        cursor.readValue("null");
        return new NullLiteral();
    }

    // eslint-disable-next-line class-methods-use-this
    template(): string {
        return "null";
    }
}