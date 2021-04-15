import { TokenReader } from "./interface";
import { buildBoolMap, BoolMap } from "./utils";

export class MaxLengthEntryArrayTokenReader
implements TokenReader {

    private maxLength: number;
    private map: BoolMap;
    constructor(
        entryChars: string[],
        maxLength: number
    ) {
        this.map = buildBoolMap(entryChars);
        this.maxLength = maxLength;
    }

    read(text: string, position: number): string {
        const start = position;
        const maxEnd = Math.min(
            text.length,
            position + this.maxLength
        );

        for (; position < maxEnd; position++) {
            const char = text[ position ];
            if ( !(char in this.map) ) {
                break;
            }
        }

        return text.slice(start, position);
    }
}