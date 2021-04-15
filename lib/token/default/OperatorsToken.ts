import { Token, TokenDescription } from "../Token";

export class OperatorsToken extends Token {

    static description: TokenDescription = {
        entry: [
            // math
            "%", "*", "+", "/", "-",
            // compare
            "<", "=", ">",
            // logic
            "&", "|", "!", "?",
            // other
            ".", "^", "~", "@"
        ],
        maxLength: 1
    };
}