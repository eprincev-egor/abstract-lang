import { TokenReader } from "./interface";
import { buildBoolMap, BoolMap } from "./utils";

export class MaxLengthEntryRegExpTokenReader
implements TokenReader {

    private entry: RegExp;
    private map: BoolMap;
    private maxLength: number;
    constructor(
        entry: RegExp,
        popularChars: string[],
        maxLength: number
    ) {
        this.entry = entry;
        this.maxLength = maxLength;
        this.map = buildBoolMap(popularChars);
    }

    read(text: string, position: number): string {
        const start = position;
        const maxEnd = Math.min(
            text.length,
            position + this.maxLength
        );

        for (; position < maxEnd; position++) {
            const char = text[ position ];
            const validChar = char in this.map || this.entry.test(char);
            if ( !validChar ) {
                break;
            }
        }

        return text.slice(start, position);
    }
}