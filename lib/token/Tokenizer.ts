import { EndOfFleToken } from "./EndOfFileToken";
import { Token } from "./Token";
import { TokenMap } from "./TokenMap";

export class Tokenizer {

    /**
     * split text on tokens
     */
    static tokenize(map: TokenMap, text: string): Token[] {
        const tokenizer = new Tokenizer(map, text);
        return tokenizer.tokenize();
    }

    private readonly text: string;
    private position: number;
    private map: TokenMap;

    private constructor(
        map: TokenMap,
        code: string
    ) {
        this.map = map;
        this.text = code;
        this.position = 0;
    }

    private tokenize(): Token[] {
        const tokens: Token[] = [];

        while ( this.position < this.text.length ) {
            const start = this.position;
            const char = this.text[ this.position ];
            const TokenClass = this.map.getTokenClass(char);

            if ( TokenClass ) {
                const tokenValue = TokenClass.read(
                    this.text,
                    this.position
                );
                this.position += tokenValue.length;

                const token = new TokenClass(tokenValue, start);
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
