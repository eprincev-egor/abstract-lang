import { AbstractSyntax, Cursor } from "../../index";

export class StringLiteral extends AbstractSyntax {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeValue("\"");
    }

    static parse(cursor: Cursor): StringLiteral {
        // require open quote
        cursor.readValue("\"");
        let content = "";

        while ( !cursor.beforeValue("\"") && !cursor.beforeEnd() ) {

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
        cursor.readValue("\"");

        return new StringLiteral(
            content
        );
    }

    readonly string: string;
    protected constructor(content: string) {
        super();
        this.string = content;
    }

    template(): string {
        return this.string;
    }
}