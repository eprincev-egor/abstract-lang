import { AbstractSyntax, Cursor, EolToken, SpaceToken } from "abstract-lang";
import { JsonSyntax } from "./JsonSyntax";
import { cycleDeps } from "./cycleDeps";

export class ArrayLiteral extends AbstractSyntax {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeValue("[");
    }

    static parse(cursor: Cursor): ArrayLiteral {
        cursor.readValue("[");
        cursor.skipAll(SpaceToken, EolToken);

        const array = cursor.parseChainOf(cycleDeps.JsonSyntax, ",");

        cursor.skipAll(SpaceToken, EolToken);
        cursor.readValue("]");

        return new ArrayLiteral(array);
    }

    readonly array: readonly JsonSyntax[];
    constructor(array: readonly JsonSyntax[]) {
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