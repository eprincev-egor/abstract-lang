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
            const token = this.factory.createToken(this.text, this.position);

            this.position += token.length;
            tokens.push(token);

        }

        const eof = new EndOfFleToken(this.text.length);
        tokens.push(eof);

        return tokens;
    }
}
