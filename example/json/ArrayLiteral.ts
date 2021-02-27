import { AbstractNode, Cursor, EolToken, SpaceToken } from "abstract-lang";
import { JsonNode } from "./JsonNode";
import { cycleDeps } from "./cycleDeps";

export class ArrayLiteral extends AbstractNode {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeValue("[");
    }

    static parse(cursor: Cursor): ArrayLiteral {
        cursor.readValue("[");
        cursor.skipAll(SpaceToken, EolToken);

        const array = cursor.parseChainOf(cycleDeps.JsonNode, ",");

        cursor.skipAll(SpaceToken, EolToken);
        cursor.readValue("]");

        return new ArrayLiteral(array);
    }

    readonly array: readonly JsonNode[];
    constructor(array: readonly JsonNode[]) {
        super();
        this.array = array;
    }

    template(): string {
        return "[" + this.array.map((element) =>
            element.template()
        ).join(",") + "]";
    }
}

cycleDeps.ArrayLiteral = ArrayLiteral;