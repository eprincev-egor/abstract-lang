import { AbstractNode, Cursor } from "abstract-lang";

export interface BooleanRow {
    boolean: boolean;
}

export class BooleanLiteral extends AbstractNode<BooleanRow> {

    static entry(cursor: Cursor): boolean {
        return (
            cursor.beforeValue("true") ||
            cursor.beforeValue("false")
        );
    }

    static parse(cursor: Cursor): BooleanRow {
        if ( cursor.beforeValue("true") ) {
            cursor.readValue("true");
            return {boolean: true};
        }
        else if ( cursor.beforeValue("false") ) {
            cursor.readValue("false");
            return {boolean: false};
        }

        // TODO: use cursor.throwError()
        throw new Error("syntax");
    }

    template(): string {
        return this.row.boolean.toString();
    }
}