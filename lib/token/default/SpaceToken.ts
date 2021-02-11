import { Token, TokenDescription } from "../Token";

/**
 * all space characters, excluding \n and \r
 * also @see EolToken
 */
export class SpaceToken extends Token {

    static description: TokenDescription = {
        // eslint-disable-next-line no-irregular-whitespace
        entry: /[\t\v\f \u00A0\u1680\u180E\u2000-\u200A​\u2028\u2029\u202F\u205F\u3000]/,
        popularEntry: [" ", "\t", "\f"]
    };
}