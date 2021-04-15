import { TokenClass, TokenDescription } from "./Token";

interface TokenClassByPopularChar {
    [char: string]: TokenClass;
}

export class TokenMap {

    static build(tokenClasses: TokenClass[]): TokenMap {
        if ( tokenClasses.length === 0 ) {
            throw new Error("one or more token descriptions required");
        }

        const popularMap: TokenClassByPopularChar = {};

        for (const TokenClass of tokenClasses) {
            const popularChars = getPopularChars(TokenClass.description);

            for (const popularChar of popularChars) {
                if (
                    TokenClass.description.entry instanceof RegExp &&
                    !TokenClass.description.entry.test(popularChar)
                ) {
                    throw new Error([
                        `${TokenClass.name}:`,
                        `popular entry char "${popularChar}"`,
                        `does not match entry: ${String(TokenClass.description.entry)}`
                    ].join(" "));
                }

                const existentTokenClass = popularMap[ popularChar ];
                if ( existentTokenClass ) {
                    throw new Error([
                        `duplicated popular entry char: "${popularChar}"`,
                        `between ${ existentTokenClass.name }`,
                        "and",
                        TokenClass.name
                    ].join(" "));
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