import { Token, TokenDescription } from "../Token";

export class AnyCharToken extends Token {
    static description: TokenDescription = {
        entry: /./,
        TokenConstructor: AnyCharToken
    };
}