import { AbstractNode, AnyRow } from "../AbstractNode";
import { AbstractScopeNode } from "./AbstractScopeNode";

export {AnyRow};

export abstract class AbstractScopeElement<T extends AnyRow>
    extends AbstractNode<T> {

    /** find parent scope node or returns undefined */
    findScope(): AbstractScopeNode<AnyRow> | undefined {
        return this.findParentInstance(AbstractScopeNode);
    }

    /** find parent scope node or throw error */
    requiredFindScope(): AbstractScopeNode<AnyRow> {
        const scopeNode = this.findScope();
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