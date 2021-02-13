import { AbstractSyntax } from "../AbstractSyntax";
import { Cursor } from "../../Cursor";

type QuoteType = "\"" | "'";

export class StringLiteral extends AbstractSyntax {

    static quote: QuoteType = "\"";
    static parse(cursor: Cursor): StringLiteral {
        // require open quote
        cursor.readValue(this.quote);
        let content = "";

        while ( !cursor.before(this.quote) && !cursor.beforeEnd() ) {

            if ( cursor.before("\\") ) {
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
        cursor.readValue(this.quote);

        return new StringLiteral(
            this.quote,
            content
        );
    }

    readonly quote: QuoteType;
    readonly string: string;
    protected constructor(quote: QuoteType, string_: string) {
        super();
        this.quote = quote;
        this.string = string_;
    }

    protected template(): string {
        return this.string;
    }
}