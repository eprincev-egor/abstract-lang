import { TokenDescription } from "./Token";

export class TokenMap {

    private readonly descriptions: TokenDescription[];
    private readonly popularMap: {
        readonly [char: string]: TokenDescription;
    };

    constructor(descriptions: TokenDescription[]) {
        if ( descriptions.length === 0 ) {
            throw new Error("one or more token descriptions required");
        }

        this.descriptions = descriptions;
        this.popularMap = buildPopularMap(descriptions);
    }

    getDescription(char: string): TokenDescription {
        const descriptionByPopularChar = this.popularMap[ char ];
        if ( descriptionByPopularChar ) {
            return descriptionByPopularChar;
        }

        for (const description of this.descriptions) {
            if ( description.entry.test(char) ) {
                return description;
            }
        }

        throw new Error(`Token for char "${char}" not found`);
    }
}

function buildPopularMap(descriptions: TokenDescription[]) {

    const popularMap: {
        [char: string]: TokenDescription;
    } = {};

    for (const description of descriptions) {
        const popularChars = description.popularEntry || [];

        for (const popularChar of popularChars) {
            if ( !description.entry.test(popularChar) ) {
                throw new Error([
                    `${description.TokenConstructor.name}:`,
                    `popular entry char "${popularChar}"`,
                    `does not match entry: ${String(description.entry)}`
                ].join(" "));
            }

            const existentDescription = popularMap[ popularChar ];
            if ( existentDescription ) {
                throw new Error([
                    `duplicated popular entry char: "${popularChar}"`,
                    `between ${ existentDescription.TokenConstructor.name }`,
                    "and",
                    description.TokenConstructor.name
                ].join(" "));
            }
            popularMap[ popularChar ] = description;
        }
    }

    return popularMap;
}