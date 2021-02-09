import { Position } from "./Position";

export type TokenConstructor = new (
    value: string,
    position: Position
) => Token;

export interface TokenDescription {
    entry: RegExp;
    popularEntry?: string[];
    TokenConstructor: TokenConstructor;
}

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