import { AbstractNode, AnyRow } from "../AbstractNode";
import { isPrimitive } from "./isPrimitive";

export function forEachChildNode(
    root: unknown,
    iteration: (node: AbstractNode<AnyRow>) => void,
    stack: any[] = []
): void {
    if ( isPrimitive(root) || root instanceof Date ) {
        return;
    }

    if ( stack.includes(root) ) {
        return;
    }
    stack.push(root);

    if ( root instanceof AbstractNode ) {
        iteration(root);
        forEachChildNode(root.row, iteration, stack);
        return;
    }

    if ( Array.isArray(root) ) {
        for (const item of root) {
            forEachChildNode(item, iteration, stack);
        }
        return;
    }

    const object = root as {[key: string]: any};
    for (const key in object) {
        const value = object[ key ] as unknown;
        forEachChildNode(value, iteration, stack);
    }
}
