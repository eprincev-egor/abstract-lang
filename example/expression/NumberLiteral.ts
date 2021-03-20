import {
    AbstractNode,
    Cursor,
    DigitsToken
} from "abstract-lang";

export interface NumberRow {
    number: string;
}

export class NumberLiteral extends AbstractNode<NumberRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeToken(DigitsToken);
    }

    static parse(cursor: Cursor): NumberRow {
        let numb = cursor.read(DigitsToken).value;

        if ( cursor.beforeValue(".") ) {
            numb += cursor.readValue(".");
            numb += cursor.read(DigitsToken).value;
        }

        return {number: numb};
    }

    template(): string {
        return this.row.number;
    }
}