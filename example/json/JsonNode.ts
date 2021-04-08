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
        return cursor.beforeOneOf([
            NullLiteral, BooleanLiteral,
            NumberLiteral, StringLiteral,
            ArrayLiteral, ObjectLiteral
        ]);
    }

    static parse(cursor: Cursor): JsonRow {
        const item = cursor.parseOneOf([
            NullLiteral, BooleanLiteral,
            NumberLiteral, StringLiteral,
            ArrayLiteral, ObjectLiteral
        ], "expected json element");

        return {json: item};
    }

    template(): JsonElement {
        return this.row.json;
    }
}

cycleDeps.JsonNode = JsonNode;