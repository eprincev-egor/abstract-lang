import { Token, TokenDescription } from "../Token";

export class SpaceToken extends Token {

    static description: TokenDescription = {
        entry: /\s/,
        popularEntry: [" ", "\t", "\n", "\r"]
    };
}