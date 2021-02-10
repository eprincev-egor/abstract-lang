import { Token, TokenDescription } from "../Token";

export class QuotesToken extends Token {

    static description: TokenDescription = {
        entry: /["'`]/,
        popularEntry: ["\"", "'", "`"],
        maxLength: 1
    };
}