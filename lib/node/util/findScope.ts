import { AbstractNode, AnyRow } from "../AbstractNode";
import { Scope } from "../Scope";

export function findScope(node: AbstractNode<AnyRow>): Scope {
    let parent = node.parent;
    while ( parent ) {
        if ( hasScope(parent) ) {
            return parent.scope;
        }

        parent = parent.parent;
    }

    const NodeClass = node.constructor;
    const NodeName = NodeClass.name;
    throw new Error(
        `required scope for node: ${NodeName}`
    );
}

interface NodeWithScope extends AbstractNode<AnyRow> {
    scope: Scope;
}
function hasScope(
    node: AbstractNode<AnyRow> | NodeWithScope
): node is NodeWithScope {
    return "scope" in node && node.scope instanceof Scope;
}