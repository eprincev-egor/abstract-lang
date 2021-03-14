import { AbstractNode, AnyRow } from "../AbstractNode";
import { Scope } from "../Scope";
import { tryFindScope } from "./tryFindScope";

export function requiredFindScope(node: AbstractNode<AnyRow>): Scope {
    const scope = tryFindScope(node);

    if ( !scope ) {
        const NodeClass = node.constructor;
        const NodeName = NodeClass.name;
        throw new Error(
            `required scope for node: ${NodeName}`
        );
    }

    return scope;
}
