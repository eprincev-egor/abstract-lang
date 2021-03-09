export interface TokenClass {
    description: TokenDescription;
    name: string;
    new (...args: any[]): Token;
    read(text: string, position: number): string;
}

/** instructions for parsing text into tokens */
export interface TokenDescription {
    /** regex that tests if a character is a given token */
    entry: RegExp;
    /** a set of the most popular token symbols to improve performance */
    popularEntry?: string[];
    /** maximum token value length, default length is Infinity */
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

    /**
     * read token symbols from text,
     * special method for Tokenizer.
     * This method can be redefined
     */
    static read(text: string, position: number): string {
        let tokenValue = "";

        while ( position < text.length ) {
            const char = text[ position ];

            const isTokenChar = (
                char in this.description.entry ||
                this.description.entry.test(char)
            );
            if ( isTokenChar ) {
                tokenValue += char;
                position++;

                const maxLengthReached = (
                    "maxLength" in this.description &&
                    tokenValue.length === this.description.maxLength
                );
                if ( maxLengthReached ) {
                    break;
                }
            }
            else {
                break;
            }
        }

        return tokenValue;
    }

    /** result of calling TokeClass.read */
    readonly value: string;
    /** index of the first char within the source text */
    readonly position: number;

    constructor(value: string, position: number) {
        this.value = value;
        this.position = position;
    }

    get length(): number {
        return this.value.length;
    }

    toJSON(): {value: string; position: number} {
        return {
            value: this.value,
            position: this.position
        };
    }

    toString(): string {
        return this.value;
    }
}