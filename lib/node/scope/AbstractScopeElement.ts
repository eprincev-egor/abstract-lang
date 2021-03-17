import { AbstractNode, AnyRow } from "../AbstractNode";
import { AbstractScopeNode } from "./AbstractScopeNode";

export {AnyRow};

export abstract class AbstractScopeElement<T extends AnyRow>
    extends AbstractNode<T> {

    findScope(): AbstractScopeNode<AnyRow> {
        const scopeNode = this.findParentInstance(AbstractScopeNode);
        if ( scopeNode ) {
            return scopeNode;
        }

        const NodeClass = this.constructor;
        const NodeName = NodeClass.name;
        throw new Error(
            `required scope for node: ${NodeName}`
        );
    }
}