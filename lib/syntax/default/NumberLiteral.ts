import { Cursor, DigitsToken, WordToken } from "../../token";
import { AbstractSyntax } from "../AbstractSyntax";

export class NumberLiteral extends AbstractSyntax {

    static parse(cursor: Cursor): NumberLiteral {
        let numb = "";
        if ( cursor.before("-") ) {
            numb += cursor.readValue("-");
        }

        numb += cursor.readToken(DigitsToken).value;

        if ( cursor.before(".") ) {
            numb += cursor.readValue(".");
            numb += cursor.readToken(DigitsToken).value;
        }

        if ( cursor.before("e") || cursor.before("E") ) {
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