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

export class JsonNode extends AbstractNode {

    static entry(): boolean {
        return true;
    }

    static parse(cursor: Cursor): JsonNode {

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

        return new JsonNode(item);
    }

    readonly json: JsonElement;
    constructor(json: JsonElement) {
        super();
        this.json = json;
    }

    template(): string {
        return this.json.template();
    }
}

cycleDeps.JsonNode = JsonNode;