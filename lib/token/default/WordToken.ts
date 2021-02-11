import { Token, TokenDescription } from "../Token";

const lowerAlphabet = [
    "a", "b", "c", "d", "e", "f", "g",
    "h", "i", "j", "k", "l", "m", "n",
    "o", "p", "q", "r", "s", "t", "u",
    "v", "w", "x", "y", "z"
];
const upperAlphabet = lowerAlphabet.map((alpha) =>
    alpha.toUpperCase()
);

export class WordToken extends Token {

    static description: TokenDescription = {
        entry: /[A-Z_a-z]/,
        popularEntry: [
            "_",
            ...lowerAlphabet,
            ...upperAlphabet
        ]
    };
}