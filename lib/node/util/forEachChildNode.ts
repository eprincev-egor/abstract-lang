/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AbstractNode, AnyRow } from "../AbstractNode";

export function forEachChildNode(
    root: AbstractNode<AnyRow>,
    iteration: (node: AbstractNode<AnyRow>) => void
): void {
    for (const key in root.row) {
        const value = root.row[ key ];

        if ( value instanceof AbstractNode ) {
            const child = value;
            iteration(child);
            forEachChildNode(child, iteration);
        }
    }
}