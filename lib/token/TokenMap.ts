import { TokenClass, TokenDescription } from "./Token";
import {
    invalidPopularCharError,
    duplicatedPopularCharError,
    requireTokenClassesError
} from "./errors";

interface TokenClassByPopularChar {
    [char: string]: TokenClass;
}

export class TokenMap {

    static build(tokenClasses: TokenClass[]): TokenMap {
        if ( tokenClasses.length === 0 ) {
            throw requireTokenClassesError();
        }

        const popularMap: TokenClassByPopularChar = {};

        for (const TokenClass of tokenClasses) {
            const popularChars = getPopularChars(TokenClass.description);

            for (const popularChar of popularChars) {
                if (
                    TokenClass.description.entry instanceof RegExp &&
                    !TokenClass.description.entry.test(popularChar)
                ) {
                    throw invalidPopularCharError(TokenClass, popularChar);
                }

                const existentTokenClass = popularMap[ popularChar ];
                if ( existentTokenClass ) {
                    throw duplicatedPopularCharError(
                        TokenClass, existentTokenClass,
                        popularChar
                    );
                }

                popularMap[ popularChar ] = TokenClass;
            }
        }

        return new TokenMap(popularMap, tokenClasses);
    }

    private map: TokenClassByPopularChar;
    private tokenClasses: TokenClass[];
    private constructor(map: TokenClassByPopularChar, tokenClasses: TokenClass[]) {
        this.map = map;
        this.tokenClasses = tokenClasses;
    }

    get(char: string): TokenClass | undefined {
        const descriptionByPopularChar = this.map[ char ];
        if ( descriptionByPopularChar ) {
            return descriptionByPopularChar;
        }

        for (const TokenClass of this.tokenClasses) {
            if (
                TokenClass.description.entry instanceof RegExp ?
                    TokenClass.description.entry.test(char) :
                    TokenClass.description.entry.includes(char)
            ) {
                return TokenClass;
            }
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
