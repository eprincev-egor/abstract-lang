import { EndOfFleToken } from "./EndOfFileToken";
import { Position } from "./Position";
import { Token, TokenClass } from "./Token";
import { TokenMap } from "./TokenMap";

export class Tokenizer {

    static tokenize(map: TokenMap, code: string): Token[] {
        const tokenizer = new Tokenizer(map, code);
        return tokenizer.tokenize();
    }

    private readonly code: string;
    private cursor: number;
    private map: TokenMap;

    private constructor(
        map: TokenMap,
        code: string
    ) {
        this.map = map;
        this.code = code;
        this.cursor = 0;
    }

    private tokenize(): Token[] {
        const tokens: Token[] = [];

        while ( this.cursor < this.code.length ) {
            const start = this.cursor;
            const char = this.code[ this.cursor ];
            const TokenClass = this.map.getTokenClass(char);

            if ( TokenClass ) {

                const tokenValue = this.read(TokenClass);

                const end = this.cursor;
                const position = new Position(start, end);

                const token = new TokenClass(tokenValue, position);
                tokens.push(token);
            }
            else {
                const tokenValue = char;
                this.cursor++;

                const end = this.cursor;
                const position = new Position(start, end);

                const token = new Token(tokenValue, position);
                tokens.push(token);
            }

        }

        const end = new Position(
            this.code.length,
            this.code.length
        );
        const eof = new EndOfFleToken(end);
        tokens.push(eof);

        return tokens;
    }

    private read(TokenClass: TokenClass) {
        let tokenValue = "";

        while ( this.cursor < this.code.length ) {
            const char = this.code[ this.cursor ];

            if ( TokenClass.description.entry.test(char) ) {
                tokenValue += char;
                this.cursor++;

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
