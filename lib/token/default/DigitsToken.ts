import { Token, TokenDescription } from "../Token";

export class DigitsToken extends Token {

    static description: TokenDescription = {
        entry: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
    };
}