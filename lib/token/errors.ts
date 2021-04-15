import { TokenClass } from "./Token";

export function requireTokenClassesError(): Error {
    return new Error("one or more token descriptions required");
}

export function invalidPopularCharError(
    TokenClass: TokenClass,
    popularChar: string
): Error {
    return new Error([
        `${TokenClass.name}:`,
        `popular entry char "${popularChar}"`,
        `does not match entry: ${String(TokenClass.description.entry)}`
    ].join(" "));
}

export function duplicatedPopularCharError(
    TokenClass: TokenClass,
    existentTokenClass: TokenClass,
    popularChar: string
): Error {
    return new Error([
        `duplicated popular entry char: "${popularChar}"`,
        `between ${ existentTokenClass.name }`,
        "and",
        TokenClass.name
    ].join(" "));
}