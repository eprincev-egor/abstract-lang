import { AbstractNode, Cursor } from "abstract-lang";
import { ArrayLiteral } from "./ArrayLiteral";
import { BooleanLiteral } from "./BooleanLiteral";
import { NullLiteral } from "./NullLiteral";
import { NumberLiteral } from "./NumberLiteral";
import { StringLiteral } from "./StringLiteral";
import { cycleDeps } from "./cycleDeps";

export type JsonElement = (
    NullLiteral |
    BooleanLiteral |
    NumberLiteral |
    StringLiteral |
    ArrayLiteral
);

export interface JsonRow {
    json: JsonElement;
}

export class JsonNode extends AbstractNode<JsonRow> {

    static entry(): boolean {
        return true;
    }

    static parse(cursor: Cursor): JsonRow {

        const {ArrayLiteral} = cycleDeps;

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

        return {json: item};
    }

    template(): string {
        return this.row.json.template();
    }
}

cycleDeps.JsonNode = JsonNode;