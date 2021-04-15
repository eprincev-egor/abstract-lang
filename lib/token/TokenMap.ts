import { TokenClass } from "./Token";

export interface TokenByPopularChar {
    [char: string]: TokenClass;
}
export type TokenClassWithRegExp =TokenClass & {
    description: {
        entry: RegExp;
        popularEntry?: string[];
    };
};
export type TokenByRegExp = TokenClassWithRegExp[];


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

    get(char: string): TokenClass | undefined {
        const TokenByChar = this.byChar[ char ];
        if ( TokenByChar ) {
            return TokenByChar;
        }

        for (const TokenClass of this.byRegExp) {
            if ( TokenClass.description.entry.test(char) ) {
                return TokenClass;
            }
        }
    }
}
