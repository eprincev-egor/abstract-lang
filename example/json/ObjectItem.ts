import { AbstractNode, Cursor, EolToken, SpaceToken } from "abstract-lang";
import { JsonNode } from "./JsonNode";
import { StringLiteral } from "./StringLiteral";
import { cycleDeps } from "./cycleDeps";

export interface ObjectItemRow {
    key: StringLiteral;
    value: JsonNode;
}

export class ObjectItem extends AbstractNode<ObjectItemRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.before(StringLiteral);
    }

    static parse(cursor: Cursor): ObjectItemRow {
        const key = cursor.parse(StringLiteral);

        cursor.skipAll(SpaceToken, EolToken);
        cursor.readValue(":");
        cursor.skipAll(SpaceToken, EolToken);

        const value = cursor.parse(cycleDeps.JsonNode);

        return {key, value};
    }

    template(): string {
        const {key, value} = this.row;
        return key.template() + ": " + value.template();
    }
}