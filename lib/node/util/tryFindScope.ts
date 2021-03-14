import { AbstractNode, AnyRow } from "../AbstractNode";
import { Scope } from "../Scope";

export function tryFindScope(node: AbstractNode<AnyRow>): Scope | undefined {
    let parent = node.parent;
    while ( parent ) {
        if ( hasScope(parent) ) {
            return parent.scope;
        }

        parent = parent.parent;
    }
}

interface NodeWithScope extends AbstractNode<AnyRow> {
    scope: Scope;
}
function hasScope(
    node: AbstractNode<AnyRow> | NodeWithScope
): node is NodeWithScope {
    return "scope" in node && !!node.scope;
}