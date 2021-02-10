import { TokenClass } from "./Token";

export class TokenMap {

    private readonly tokenClasses: TokenClass[];
    private readonly popularMap: {
        readonly [char: string]: TokenClass;
    };

    constructor(tokenClasses: TokenClass[]) {
        if ( tokenClasses.length === 0 ) {
            throw new Error("one or more token descriptions required");
        }

        this.tokenClasses = tokenClasses;
        this.popularMap = buildPopularMap(tokenClasses);
    }

    getTokenClass(char: string): TokenClass | undefined {
        const descriptionByPopularChar = this.popularMap[ char ];
        if ( descriptionByPopularChar ) {
            return descriptionByPopularChar;
        }

        for (const TokenClass of this.tokenClasses) {
            if ( TokenClass.description.entry.test(char) ) {
                return TokenClass;
            }
        }
    }
}

function buildPopularMap(tokenClasses: TokenClass[]) {

    const popularMap: {
        [char: string]: TokenClass;
    } = {};

    for (const TokenClass of tokenClasses) {
        const popularChars = TokenClass.description.popularEntry || [];

        for (const popularChar of popularChars) {
            if ( !TokenClass.description.entry.test(popularChar) ) {
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

    return popularMap;
}