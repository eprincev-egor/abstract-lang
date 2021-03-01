import {
    AbstractNode,
    Cursor,
    EolToken, SpaceToken,
    TemplateElement, _
} from "abstract-lang";
import { JsonElement } from "./JsonNode";
import { StringLiteral } from "./StringLiteral";
import { cycleDeps } from "./cycleDeps";

export interface ObjectItemRow {
    key: StringLiteral;
    value: JsonElement;
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

        const value = cursor.parse(cycleDeps.JsonNode).row.json;

        return {key, value};
    }

    template(): TemplateElement[] {
        return [
            this.row.key,
            ":", _,
            this.row.value
        ];
    }
}