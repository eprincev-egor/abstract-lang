import { AbstractNode, Cursor, EolToken, SpaceToken } from "abstract-lang";
import { JsonNode } from "./JsonNode";
import { StringLiteral } from "./StringLiteral";
import { cycleDeps } from "./cycleDeps";

export class ObjectItem extends AbstractNode {

    static entry(cursor: Cursor): boolean {
        return cursor.before(StringLiteral);
    }

    static parse(cursor: Cursor): ObjectItem {
        const key = cursor.parse(StringLiteral);

        cursor.skipAll(SpaceToken, EolToken);
        cursor.readValue(":");
        cursor.skipAll(SpaceToken, EolToken);

        const value = cursor.parse(cycleDeps.JsonNode);

        return new ObjectItem(key, value);
    }

    readonly key: StringLiteral;
    readonly value: JsonNode;
    constructor(key: StringLiteral, value: JsonNode) {
        super();
        this.key = key;
        this.value = value;
    }

    template(): string {
        return this.key.template() + ": " + this.value.template();
    }
}