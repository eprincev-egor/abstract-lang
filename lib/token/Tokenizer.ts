import { EndOfFleToken } from "./EndOfFileToken";
import { Token } from "./Token";
import { TokenFactory } from "./TokenFactory";

export class Tokenizer {

    /** split text into tokens */
    static tokenize(map: TokenFactory, text: string): Token[] {
        const tokenizer = new Tokenizer(map, text);
        return tokenizer.tokenize();
    }

    private readonly text: string;
    private position: number;
    private factory: TokenFactory;

    private constructor(
        map: TokenFactory,
        code: string
    ) {
        this.factory = map;
        this.text = code;
        this.position = 0;
    }

    private tokenize(): Token[] {
        const tokens: Token[] = [];

        while ( this.position < this.text.length ) {
            const start = this.position;
            const char = this.text[ this.position ];
            const result = this.factory.getTokenClass(char);

            if ( result ) {
                const tokenValue = result.TokenClass.read(
                    this.text,
                    this.position
                );
                this.position += tokenValue.length;

                const token = new result.TokenClass(tokenValue, start);
                tokens.push(token);
            }
            else {
                const tokenValue = char;
                this.position++;

                const token = new Token(tokenValue, start);
                tokens.push(token);
            }

        }

        const eof = new EndOfFleToken(this.text.length);
        tokens.push(eof);

        return tokens;
    }
}
