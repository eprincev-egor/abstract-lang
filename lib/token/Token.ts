export interface TokenClass {
    description: TokenDescription;
    name: string;
    new (...args: any[]): Token;
}

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
     * maximum token value length,
     * default length is Infinity
     */
    maxLength?: number;
}

/**
 * Default token instance,
 * if there is no more suitable instance.
 * This token every time will contain only one character.
 */
export class Token {

    static description: TokenDescription = {
        entry: /./,
        maxLength: 1
    };

    readonly value: string;
    /**
     * index of the first char within the source text
     */
    readonly position: number;

    constructor(value: string, position: number) {
        this.value = value;
        this.position = position;
    }

    /**
     * equal token value with string
     */
    is(equal: string): boolean {
        return this.value === equal;
    }

    /**
     * startsWith
     */
    startsWith(value: string): boolean {
        return this.value.indexOf(value) === 0;
    }

    toJSON(): {value: string; position: number} {
        return {
            value: this.value,
            position: this.position
        };
    }
}