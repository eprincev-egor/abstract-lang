import { AbstractNode, Cursor } from "abstract-lang";
import { ArrayLiteral } from "./ArrayLiteral";
import { BooleanLiteral } from "./BooleanLiteral";
import { NullLiteral } from "./NullLiteral";
import { NumberLiteral } from "./NumberLiteral";
import { StringLiteral } from "./StringLiteral";
import { cycleDeps } from "./cycleDeps";
import { ObjectLiteral } from "./ObjectLiteral";

export type JsonElement = (
    NullLiteral |
    BooleanLiteral |
    NumberLiteral |
    StringLiteral |
    ArrayLiteral |
    ObjectLiteral
);

export interface JsonRow {
    json: JsonElement;
}

export class JsonNode extends AbstractNode<JsonRow> {

    static entry(cursor: Cursor): boolean {
        return (
            cursor.before(NullLiteral) ||
            cursor.before(BooleanLiteral) ||
            cursor.before(NumberLiteral) ||
            cursor.before(StringLiteral) ||
            cursor.before(ArrayLiteral) ||
            cursor.before(ObjectLiteral)
        );
    }

    static parse(cursor: Cursor): JsonRow {

        const {ArrayLiteral, ObjectLiteral} = cycleDeps;

        let item!: JsonElement;
        if ( cursor.before(NullLiteral) ) {
            item = cursor.parse(NullLiteral);
        }
        else if ( cursor.before(BooleanLiteral) ) {
            item = cursor.parse(BooleanLiteral);
        }
        else if ( cursor.before(NumberLiteral) ) {
            item = cursor.parse(NumberLiteral);
        }
        else if ( cursor.before(StringLiteral) ) {
            item = cursor.parse(StringLiteral);
        }
        else if ( cursor.before(ArrayLiteral) ) {
            item = cursor.parse(ArrayLiteral);
        }
        else {
            item = cursor.parse(ObjectLiteral);
        }

        return {json: item};
    }

    template(): JsonElement {
        return this.row.json;
    }
}

cycleDeps.JsonNode = JsonNode;