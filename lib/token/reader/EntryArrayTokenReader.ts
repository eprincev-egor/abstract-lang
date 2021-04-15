import { TokenReader } from "./interface";
import { buildBoolMap, BoolMap } from "./utils";

export class EntryArrayTokenReader
implements TokenReader {

    private map: BoolMap;
    constructor(entryChars: string[]) {
        this.map = buildBoolMap(entryChars);
    }

    read(text: string, position: number): string {
        const start = position;

        while ( position < text.length ) {
            if ( text[ position ] in this.map ) {
                position++;
            }
            else {
                break;
            }
        }

        return text.slice(start, position);
    }
}