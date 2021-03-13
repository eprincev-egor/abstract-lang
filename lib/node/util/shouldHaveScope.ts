import { Scope } from "node/Scope";
import { AbstractNode, AnyRow } from "../AbstractNode";

export function shouldHaveScope(
    node: AbstractNode<AnyRow>
): asserts node is AbstractNode<AnyRow> & {scope: Scope} {
    if ( !node.scope ) {
        const className = node.constructor.name;
        throw new Error(`required scope for node: ${className}`);
    }
}