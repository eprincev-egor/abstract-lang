import { AbstractNode } from "../AbstractNode";

export function setParent(
    parent: AbstractNode<any>,
    children: any[],
    stack: any[] = []
): void {
    for (const child of children) {
        if ( stack.includes(child) ) {
            continue;
        }
        stack.push(child);

        if ( child instanceof AbstractNode ) {
            child.parent = parent;
        }
        else if ( Array.isArray(child) ) {
            const unknownArray = child;
            setParent(parent, unknownArray, stack);
        }
        else if ( child && typeof child === "object" ) {
            setParent(parent, Object.values(child), stack);
        }
    }
}