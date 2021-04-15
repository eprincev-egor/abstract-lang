import { TokenReader } from "./interface";

export class OneCharTokenReader
implements TokenReader {

    // eslint-disable-next-line class-methods-use-this
    read(text: string, position: number): string {
        return text[ position ];
    }

}