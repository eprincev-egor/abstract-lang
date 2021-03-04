import {
    AbstractNode,
    Cursor, EndOfLineToken, SpaceToken,
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
        cursor.skipAll(SpaceToken, EndOfLineToken);

        if ( cursor.before(JsonNode) ) {
            array = cursor.parseChainOf(JsonNode, ",").map((node) =>
                node.row.json
            );
        }

        cursor.skipAll(SpaceToken, EndOfLineToken);
        cursor.readValue("]");

        return {array};
    }

    template(): TemplateElement[] {
        const output: TemplateElement[] = ["["];

        for (const item of this.row.array) {
            if ( output.length > 1 ) {
                output.push(",", _);
            }

            output.push(item);
        }

        output.push("]");
        return output;
    }
}

cycleDeps.ArrayLiteral = ArrayLiteral;