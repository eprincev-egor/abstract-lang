import {
    AbstractNode,
    Cursor, EndOfLineToken, SpaceToken,
    TemplateElement, eol, tab
} from "abstract-lang";
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
        let object: ObjectItem[] = [];
        cursor.readValue("{");
        cursor.skipAll(SpaceToken, EndOfLineToken);

        if ( cursor.before(ObjectItem) ) {
            object = cursor.parseChainOf(ObjectItem, ",");
        }

        cursor.skipAll(SpaceToken, EndOfLineToken);
        cursor.readValue("}");

        return {object};
    }

    template(): string | TemplateElement[] {
        if ( this.row.object.length === 0 ) {
            return "{}";
        }

        const output: TemplateElement[] = [
            "{", eol
        ];
        for (const item of this.row.object) {
            if ( output.length > 2 ) {
                output.push(",", eol);
            }

            output.push(tab, item);
        }

        output.push(eol, "}");
        return output;
    }
}

cycleDeps.ObjectLiteral = ObjectLiteral;