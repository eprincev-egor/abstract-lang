import { Token, TokenClass } from "./Token";
import { TokenMap } from "./TokenMap";
import { TokenMapBuilder } from "./TokenMapBuilder";

export class TokenFactory {

    private readonly map: TokenMap;

    constructor(tokenClasses: TokenClass[]) {
        this.map = TokenMapBuilder.build(tokenClasses);
    }

    createToken(text: string, position: number): Token {
        const char = text[ position ];
        const result = this.map.get(char);

        if ( result ) {
            const start = position;
            const tokenValue = result.reader.read(text, position);
            const token = new result.TokenClass(tokenValue, start);
            return token;
        }
        else {
            const token = new Token(char, position);
            return token;
        }
    }
}
