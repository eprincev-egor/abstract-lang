import {
    AbstractSyntax,
    Cursor,
    DigitsToken,
    WordToken
} from "../../index";

export class NumberLiteral extends AbstractSyntax {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeToken(DigitsToken);
    }

    static parse(cursor: Cursor): NumberLiteral {
        let numb = "";
        if ( cursor.beforeValue("-") ) {
            numb += cursor.readValue("-");
        }

        numb += cursor.read(DigitsToken).value;

        if ( cursor.beforeValue(".") ) {
            numb += cursor.readValue(".");
            numb += cursor.read(DigitsToken).value;
        }

        if ( cursor.beforeValue("e") || cursor.beforeValue("E") ) {
            numb += "e";
            cursor.skipOne(WordToken);

            numb += cursor.read(DigitsToken).value;
        }

        return new NumberLiteral(numb);
    }

    readonly number: string;
    protected constructor(numb: string) {
        super();
        this.number = numb;
    }

    template(): string {
        return this.number;
    }
}