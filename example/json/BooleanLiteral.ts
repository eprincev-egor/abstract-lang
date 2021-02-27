import { AbstractNode, Cursor } from "abstract-lang";

export class BooleanLiteral extends AbstractNode {

    static entry(cursor: Cursor): boolean {
        return (
            cursor.beforeValue("true") ||
            cursor.beforeValue("false")
        );
    }

    static parse(cursor: Cursor): BooleanLiteral {
        if ( cursor.beforeValue("true") ) {
            cursor.readValue("true");
            return new BooleanLiteral(true);
        }
        else if ( cursor.beforeValue("false") ) {
            cursor.readValue("false");
            return new BooleanLiteral(false);
        }

        // TODO: use cursor.throwError()
        throw new Error("syntax");
    }

    readonly boolean: boolean;
    constructor(boolean: boolean) {
        super();
        this.boolean = boolean;
    }

    template(): string {
        return this.boolean.toString();
    }
}