import { EndOfFleToken } from "./EndOfFileToken";
import { Token, TokenClass } from "./Token";
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
                const tokenValue = this.read(TokenClass);
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

    private read(TokenClass: TokenClass) {
        let tokenValue = "";

        while ( this.position < this.text.length ) {
            const char = this.text[ this.position ];

            if ( TokenClass.description.entry.test(char) ) {
                tokenValue += char;
                this.position++;

                const maxLengthReached = (
                    "maxLength" in TokenClass.description &&
                    tokenValue.length === TokenClass.description.maxLength
                );
                if ( maxLengthReached ) {
                    break;
                }
            }
            else {
                break;
            }
        }

        return tokenValue;
    }
}
