import { TemplateElement } from "./stringifyNode";

/** returns array of children nodes with delimiter between nodes */
export function printChain(
    elements: TemplateElement[],
    ...delimiter: TemplateElement[]
): TemplateElement[] {
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
