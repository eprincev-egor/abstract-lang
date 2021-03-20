import { AbstractNode, Cursor } from "abstract-lang";

export interface StringRow {
    string: string;
}

export class StringLiteral extends AbstractNode<StringRow> {

    static entry(cursor: Cursor): boolean {
        return (
            cursor.beforeValue("\"") ||
            cursor.beforeValue("'")
        );
    }

    static parse(cursor: Cursor): StringRow {
        // require open quote
        const quotes = cursor.beforeValue("'") ? "'" : "\"";
        cursor.readValue(quotes);

        let content = "";

        while ( !cursor.beforeValue(quotes) && !cursor.beforeEnd() ) {

            if ( cursor.beforeValue("\\") ) {
                cursor.readValue("\\");

                const someValue = cursor.nextToken.value;
                const escapedCharCode = someValue[0];
                const escapedChar = eval(`"\\${escapedCharCode}"`) as string;

                content += escapedChar;
                content += someValue.slice(1);
            }
            else {
                content += cursor.nextToken.value;
            }

            cursor.next();
        }

        // require close quote
        cursor.readValue(quotes);

        return {string: content};
    }

    template(): string {
        const escaped = this.row.string
            .replace(/['\\]/g, (invalid) =>
                "\\" + invalid
            )
            .replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r");

        return "'" + escaped + "'";
    }
}