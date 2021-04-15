import { TokenReader } from "./reader/interface";
import { TokenClass } from "./Token";

export interface TokenClassAndReader {
    TokenClass: TokenClass;
    reader: TokenReader;
}

export interface TokenByPopularChar {
    [char: string]: TokenClassAndReader;
}
export type TokenClassWithRegExp = TokenClass & {
    description: {
        entry: RegExp;
        popularEntry?: string[];
    };
};
export interface TokenClassWithRegExpAndReader extends TokenClassAndReader {
    TokenClass: TokenClassWithRegExp;
}
export type TokenByRegExp = TokenClassWithRegExpAndReader[];


export class TokenMap {

    private byChar: TokenByPopularChar;
    private byRegExp: TokenByRegExp;
    constructor(
        byChar: TokenByPopularChar,
        byRegExp: TokenByRegExp
    ) {
        this.byChar = byChar;
        this.byRegExp = byRegExp;
    }

    get(char: string): TokenClassAndReader | undefined {
        const byChar = this.byChar[ char ];
        if ( byChar ) {
            return byChar;
        }

        for (const byRegExp of this.byRegExp) {
            if ( byRegExp.TokenClass.description.entry.test(char) ) {
                return byRegExp;
            }
        }
    }
}
