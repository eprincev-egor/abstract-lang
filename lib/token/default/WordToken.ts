import { Token, TokenDescription } from "../Token";

const lowerAlphabet = (
    "abcdefghijklmnopqrstuvwxyz" +
    "абвгдеёжзийклмнопрстуфхцчшщыъьэюя"
).split("");

const upperAlphabet = lowerAlphabet.map((alpha) =>
    alpha.toUpperCase()
);

export class WordToken extends Token {

    static description: TokenDescription = {
        entry: [
            "_",
            ...lowerAlphabet,
            ...upperAlphabet
        ]
    };
}