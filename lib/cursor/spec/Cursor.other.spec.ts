import * as assert from "assert";
import { Cursor } from "../Cursor";
import {
    Tokenizer,
    defaultMap,
    WordToken,
    DigitsToken
} from "../../token";

describe("Cursor.other.spec.ts other methods", () => {

    it("usage example: parse single quotes", () => {

        const escape = "\\";
        const quote = "'";

        function parseQuotes(text: string) {
            const tokens = Tokenizer.tokenize(
                defaultMap,
                text
            );
            const cursor = new Cursor(tokens);

            // require open quote
            cursor.readValue(quote);
            let content = "";

            while ( !cursor.beforeValue(quote) && !cursor.beforeEnd() ) {

                if ( cursor.beforeValue(escape) ) {
                    cursor.readValue(escape);

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
            cursor.readValue(quote);
            return content;
        }

        const quotesContent = parseQuotes("'hello \\'\\nworld\"'");
        assert.strictEqual(quotesContent, "hello '\nworld\"");
    });

    it("usage example: number literal", () => {

        // eslint-disable-next-line unicorn/consistent-function-scoping
        function parseNumber(text: string): number {
            const tokens = Tokenizer.tokenize(
                defaultMap,
                text
            );
            const cursor = new Cursor(tokens);

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

            return +numb;
        }

        assert.strictEqual( parseNumber("1"), 1 );
        assert.strictEqual( parseNumber("-1"), -1 );
        assert.strictEqual( parseNumber("1.10"), 1.1 );
        assert.strictEqual( parseNumber("-1.10"), -1.1 );
        assert.strictEqual( parseNumber("1e3"), 1000 );
        assert.strictEqual( parseNumber("1E10"), 1e10 );
        assert.strictEqual( parseNumber("123456700.123E2"), 12345670012.3 );
        assert.strictEqual( parseNumber("1e2w3"), 100 );
    });

});