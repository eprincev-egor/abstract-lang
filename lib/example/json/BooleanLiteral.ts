import { AbstractSyntax, Cursor } from "../../index";

export class BooleanLiteral extends AbstractSyntax {

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