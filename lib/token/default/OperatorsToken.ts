import { Token, TokenDescription } from "../Token";

export class OperatorsToken extends Token {

    static description: TokenDescription = {
        entry: /[!%&*+./<=>?^|~-]/,
        popularEntry: [
            // math
            "%", "*", "+", "/", "-",
            // compare
            "<", "=", ">",
            // logic
            "&", "|", "!", "?",
            // other
            ".", "^", "~"
        ],
        TokenConstructor: OperatorsToken
    };
}