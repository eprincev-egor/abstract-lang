import {
    AbstractNode, Cursor,
    printChain,
    TemplateElement, _
} from "abstract-lang";
import { JsonElement } from "./JsonNode";
import { cycleDeps } from "./cycleDeps";

export interface ArrayRow {
    array: readonly JsonElement[];
}

export class ArrayLiteral extends AbstractNode<ArrayRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeValue("[");
    }

    static parse(cursor: Cursor): ArrayRow {
        const {JsonNode} = cycleDeps;
        let array: JsonElement[] = [];

        cursor.readValue("[");
        cursor.skipSpaces();

        if ( cursor.before(JsonNode) ) {
            array = cursor.parseChainOf(JsonNode, ",").map((node) =>
                node.row.json
            );
        }

        cursor.skipSpaces();
        cursor.readValue("]");

        return {array};
    }

    template(): TemplateElement[] {
        return [
            "[",
            ...printChain(
                this.row.array,
                ",", _
            ),
            "]"
        ];
    }
}

cycleDeps.ArrayLiteral = ArrayLiteral;