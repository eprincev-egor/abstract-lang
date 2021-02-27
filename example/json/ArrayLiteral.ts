import { AbstractNode, Cursor, EolToken, SpaceToken } from "abstract-lang";
import { JsonNode } from "./JsonNode";
import { cycleDeps } from "./cycleDeps";

export interface ArrayRow {
    array: readonly JsonNode[];
}

export class ArrayLiteral extends AbstractNode<ArrayRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeValue("[");
    }

    static parse(cursor: Cursor): ArrayRow {
        cursor.readValue("[");
        cursor.skipAll(SpaceToken, EolToken);

        const array = cursor.parseChainOf(cycleDeps.JsonNode, ",");

        cursor.skipAll(SpaceToken, EolToken);
        cursor.readValue("]");

        return {array};
    }

    template(): string {
        return "[" + this.row.array.map((element) =>
            element.template()
        ).join(",") + "]";
    }
}

cycleDeps.ArrayLiteral = ArrayLiteral;