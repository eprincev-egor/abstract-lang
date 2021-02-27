import { AbstractNode, Cursor, EolToken, SpaceToken } from "abstract-lang";
import { ObjectItem } from "./ObjectItem";
import { cycleDeps } from "./cycleDeps";

export class ObjectLiteral extends AbstractNode {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeValue("{");
    }

    static parse(cursor: Cursor): ObjectLiteral {
        cursor.readValue("{");
        cursor.skipAll(SpaceToken, EolToken);

        const items = cursor.parseChainOf(ObjectItem, ",");

        cursor.skipAll(SpaceToken, EolToken);
        cursor.readValue("}");

        return new ObjectLiteral(items);
    }

    readonly object: readonly ObjectItem[];
    constructor(object: readonly ObjectItem[]) {
        super();
        this.object = object;
    }

    template(): string {
        return "{" + this.object.map((element) =>
            element.template()
        ).join(",") + "}";
    }
}

cycleDeps.ObjectLiteral = ObjectLiteral;