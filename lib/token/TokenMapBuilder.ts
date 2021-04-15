import {
    TokenMap,
    TokenByPopularChar, TokenByRegExp,
    TokenClassWithRegExp
} from "./TokenMap";
import { TokenClass, TokenDescription } from "./Token";
import {
    requireTokenClassesError,
    duplicatedPopularCharError,
    invalidPopularCharError
} from "./errors";

export class TokenMapBuilder {

    static build(tokenClasses: TokenClass[]): TokenMap {
        if ( tokenClasses.length === 0 ) {
            throw requireTokenClassesError();
        }
        const builder = new TokenMapBuilder(tokenClasses);
        return builder.build();
    }

    private readonly tokenClasses: TokenClass[];
    private constructor(tokenClasses: TokenClass[]) {
        this.tokenClasses = tokenClasses;
    }

    build(): TokenMap {
        const byChar = this.buildByPopularChar();
        const byRegExp = this.buildByRegExp();
        const map = new TokenMap(byChar, byRegExp);
        return map;
    }

    private buildByPopularChar(): TokenByPopularChar {
        const byChar: TokenByPopularChar = {};

        for (const TokenClass of this.tokenClasses) {
            const popularChars = getPopularChars(TokenClass.description);

            for (const popularChar of popularChars) {
                const existentTokenClass = byChar[ popularChar ];
                if ( existentTokenClass ) {
                    throw duplicatedPopularCharError(
                        TokenClass, existentTokenClass,
                        popularChar
                    );
                }

                byChar[ popularChar ] = TokenClass;
            }
        }

        return byChar;
    }

    private buildByRegExp(): TokenByRegExp {
        const byRegExp: TokenByRegExp = [];

        for (const TokenClass of this.tokenClasses) {
            if ( isTokenClassWithRegExp(TokenClass) ) {
                popularCharsShouldEntry(TokenClass);

                byRegExp.push(TokenClass );
            }
        }

        return byRegExp;
    }
}

function isTokenClassWithRegExp(
    TokenClass: TokenClass
): TokenClass is TokenClassWithRegExp {
    return TokenClass.description.entry instanceof RegExp;
}

function popularCharsShouldEntry(TokenClass: TokenClassWithRegExp) {
    const {description} = TokenClass;

    for (const popularChar of description.popularEntry || []) {
        if ( !description.entry.test(popularChar) ) {
            throw invalidPopularCharError(TokenClass, popularChar);
        }
    }
}

function getPopularChars(description: TokenDescription): string[] {
    if ( Array.isArray(description.entry) ) {
        return description.entry;
    }

    if ( "popularEntry" in description) {
        return description.popularEntry || [];
    }

    return [];
}