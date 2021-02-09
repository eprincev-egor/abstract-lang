import { Position } from "./Position";
import { Token, TokenDescription } from "./Token";
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
            const tokenDescription = this.map.getDescription(char);

            if ( tokenDescription ) {

                const tokenValue = this.read(tokenDescription);

                const end = this.cursor;
                const position = new Position(start, end);

                const {TokenConstructor} = tokenDescription;
                const token = new TokenConstructor(tokenValue, position);
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

        return tokens;
    }

    private read(tokenDescription: TokenDescription) {
        let tokenValue = "";

        while ( this.cursor < this.code.length ) {
            const char = this.code[ this.cursor ];

            if ( tokenDescription.entry.test(char) ) {
                tokenValue += char;
                this.cursor++;
            }
            else {
                break;
            }
        }

        return tokenValue;
    }
}

// Word;
// Digits;
// Char;
// Space;
// EOL;
