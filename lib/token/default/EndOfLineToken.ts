import { Token, TokenDescription } from "../Token";

/**
 * End of line.
 * Mac/Windows/Unix
 */
export class EndOfLineToken extends Token {

    static description: TokenDescription = {
        entry: ["\n", "\r"],
        maxLength: 2
    };

    static read(text: string, position: number): string {
        const firstChar = text[position];
        const secondChar = text[position + 1];

        // Windows
        if ( firstChar === "\r" && secondChar === "\n" ) {
            return "\r\n";
        }

        // Unix/Mac
        return firstChar;
    }
}