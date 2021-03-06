import { TemplateElement, tab } from "./stringifyNode";

/** returns array of children nodes with delimiter between nodes */
export function printChain(
    elements: readonly TemplateElement[] | undefined,
    ...delimiter: TemplateElement[]
): TemplateElement[] {
    if ( !elements ) {
        return [];
    }

    const chain: TemplateElement[] = [];

    if ( delimiter.length === 0 ) {
        delimiter = [" "];
    }

    for (const element of elements) {
        if ( chain.length > 0 ) {
            chain.push(...delimiter);
        }

        chain.push(element);
    }

    return chain;
}

/**
 * returns array of children nodes with delimiter between nodes
 * and tab before each element
 */
export function printTabChain(
    elements: readonly TemplateElement[] | undefined,
    ...delimiter: TemplateElement[]
): TemplateElement[] {
    if ( !elements ) {
        return [];
    }

    return [
        tab, ...printChain(
            elements,
            ...delimiter, tab
        )
    ];
}