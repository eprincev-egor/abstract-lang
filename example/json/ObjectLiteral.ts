import {
    AbstractNode, Cursor,
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
        cursor.skipSpaces();

        if ( cursor.before(ObjectItem) ) {
            object = cursor.parseChainOf(ObjectItem, ",");
        }

        cursor.skipSpaces();
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