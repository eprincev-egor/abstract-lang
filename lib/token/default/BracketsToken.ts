import { Token, TokenDescription } from "../Token";

export class BracketsToken extends Token {

    static description: TokenDescription = {
        entry: /[()[\]{}]/,
        popularEntry: ["[", "]", "(", ")", "{", "}"],
        maxLength: 1
    };
}