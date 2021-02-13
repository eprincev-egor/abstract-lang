import { DigitsToken, WordToken } from "../../token";
import { AbstractSyntax } from "../AbstractSyntax";
import { Cursor } from "../../Cursor";

export class NumberLiteral extends AbstractSyntax {

    static parse(cursor: Cursor): NumberLiteral {
        let numb = "";
        if ( cursor.beforeValue("-") ) {
            numb += cursor.readValue("-");
        }

        numb += cursor.readToken(DigitsToken).value;

        if ( cursor.beforeValue(".") ) {
            numb += cursor.readValue(".");
            numb += cursor.readToken(DigitsToken).value;
        }

        if ( cursor.beforeValue("e") || cursor.beforeValue("E") ) {
            numb += "e";
            cursor.skipOne(WordToken);

            numb += cursor.readToken(DigitsToken).value;
        }

        return new NumberLiteral(numb);
    }

    readonly number: string;
    protected constructor(numb: string) {
        super();
        this.number = numb;
    }

    protected template(): string {
        return this.number;
    }
}