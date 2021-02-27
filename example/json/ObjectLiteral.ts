import { AbstractNode, Cursor, EolToken, SpaceToken } from "abstract-lang";
import { ObjectItem } from "./ObjectItem";
import { cycleDeps } from "./cycleDeps";

export interface ObjectRow {
    object: readonly ObjectItem[];
}

export class ObjectLiteral extends AbstractNode<ObjectRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeValue("{");
    }

    static parse(cursor: Cursor): ObjectRow {
        cursor.readValue("{");
        cursor.skipAll(SpaceToken, EolToken);

        const object = cursor.parseChainOf(ObjectItem, ",");

        cursor.skipAll(SpaceToken, EolToken);
        cursor.readValue("}");

        return {object};
    }

    template(): string {
        return "{" + this.row.object.map((element) =>
            element.template()
        ).join(",") + "}";
    }
}

cycleDeps.ObjectLiteral = ObjectLiteral;