import { Position } from "./Position";

export type TokenConstructor = new (
    value: string,
    position: Position
) => Token;

/**
 * instructions for parsing text into tokens
 */
export interface TokenDescription {
    /**
     * regex that tests if a character is a given token
     */
    entry: RegExp;
    /**
     * a set of the most popular token symbols to improve performance
     */
    popularEntry?: string[];
    /**
     * constructor to creating a token
     */
    TokenConstructor: TokenConstructor;
}

/**
 * Default token instance,
 * if there is no more suitable instance.
 * This token every time will contain only one character.
 */
export class Token {

    static description: TokenDescription = {
        entry: /./,
        TokenConstructor: Token
    };

    readonly value: string;
    readonly position: Position;

    constructor(value: string, position: Position) {
        this.value = value;
        this.position = position;
    }

    toJSON(): {value: string; position: ReturnType<Position["toJSON"]>} {
        return {
            value: this.value,
            position: this.position.toJSON()
        };
    }
}