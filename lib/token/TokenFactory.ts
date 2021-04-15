import { TokenClass, TokenDescription } from "./Token";

export interface PopularMap {
    [char: string]: {
        TokenClass: TokenClass;
    };
}

export class TokenFactory {

    private readonly tokenClasses: TokenClass[];
    private readonly popularMap: Readonly<PopularMap>;

    constructor(tokenClasses: TokenClass[]) {
        if ( tokenClasses.length === 0 ) {
            throw new Error("one or more token descriptions required");
        }

        this.tokenClasses = tokenClasses;
        this.popularMap = buildPopularMap(tokenClasses);
    }

    getTokenClass(char: string): {TokenClass: TokenClass} | undefined {
        const descriptionByPopularChar = this.popularMap[ char ];
        if ( descriptionByPopularChar ) {
            return descriptionByPopularChar;
        }

        for (const TokenClass of this.tokenClasses) {
            if (
                TokenClass.description.entry instanceof RegExp ?
                    TokenClass.description.entry.test(char) :
                    TokenClass.description.entry.includes(char)
            ) {
                return {TokenClass};
            }
        }
    }
}

function buildPopularMap(tokenClasses: TokenClass[]): PopularMap {

    const popularMap: PopularMap = {};

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
                    `between ${ existentTokenClass.TokenClass.name }`,
                    "and",
                    TokenClass.name
                ].join(" "));
            }
            popularMap[ popularChar ] = {TokenClass};
        }
    }

    return popularMap;
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