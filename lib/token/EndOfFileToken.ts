import { Position } from "./Position";
import { Token, TokenDescription } from "./Token";

export class EndOfFleToken extends Token {
    static description: TokenDescription = {
        entry: /^$/,
        maxLength: 0
    }

    constructor(position: Position) {
        super("", position);
    }
}