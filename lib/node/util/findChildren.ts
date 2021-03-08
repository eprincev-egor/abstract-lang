import { AbstractNode, AnyRow } from "../AbstractNode";

export function findChildren(
    values: any[],
    children: AbstractNode<AnyRow>[] = [],
    stack: any[] = []
): AbstractNode<AnyRow>[] {
    for (const value of values) {
        if ( stack.includes(value) ) {
            continue;
        }
        stack.push(value);

        if ( value instanceof AbstractNode ) {
            const childNode = value;
            children.push(childNode);
        }
        else if ( Array.isArray(value) ) {
            const unknownArray = value;
            findChildren(
                unknownArray,
                children,
                stack
            );
        }
        else if ( value && typeof value === "object" ) {
            findChildren(
                Object.values(value),
                children,
                stack
            );
        }
    }

    return children;
}