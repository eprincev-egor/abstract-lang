import { Token, TokenClass } from "./Token";
import { TokenMap } from "./TokenMap";

export class TokenFactory {

    private readonly map: TokenMap;

    constructor(tokenClasses: TokenClass[]) {
        this.map = TokenMap.build(tokenClasses);
    }

    createToken(text: string, position: number): Token {
        const char = text[ position ];
        const TokenClass = this.map.get(char);

        if ( TokenClass ) {
            const start = position;
            const tokenValue = TokenClass.read(text, position);
            const token = new TokenClass(tokenValue, start);
            return token;
        }
        else {
            const token = new Token(char, position);
            return token;
        }
    }
}
