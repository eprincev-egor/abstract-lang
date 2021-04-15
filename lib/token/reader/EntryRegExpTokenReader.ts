import { TokenReader } from "./interface";
import { buildBoolMap, BoolMap } from "./utils";

export class EntryRegExpTokenReader
implements TokenReader {

    private entry: RegExp;
    private map: BoolMap;
    constructor(
        entry: RegExp,
        popularChars: string[]
    ) {
        this.entry = entry;
        this.map = buildBoolMap(popularChars);
    }

    read(text: string, position: number): string {
        const start = position;

        while ( position < text.length ) {
            const char = text[ position ];

            if ( char in this.map || this.entry.test(char) ) {
                position++;
            }
            else {
                break;
            }
        }

        return text.slice(start, position);
    }
}