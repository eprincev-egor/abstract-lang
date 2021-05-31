import { TokenClass } from "../../token/Token";
import { TokenReader } from "./interface";

export type TokenClassWithCustomRead = TokenClass & {read: TokenReader["read"]};

export class CustomTokenReader
implements TokenReader {

    readonly read: TokenReader["read"];

    constructor(
        TokenClass: TokenClassWithCustomRead
    ) {
        this.read = TokenClass.read.bind(TokenClass);
    }
}