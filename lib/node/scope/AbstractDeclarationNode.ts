import { AbstractNode, AnyRow } from "../AbstractNode";
import { AbstractDependencyNode } from "./AbstractDependencyNode";
import { AbstractScopeNode } from "./AbstractScopeNode";

export abstract class AbstractDeclarationNode<TRow extends AnyRow>
    extends AbstractNode<TRow> {

    findDependencies(): AbstractDependencyNode<any>[] {
        const scopeNode = this.findParentInstance(AbstractScopeNode);
        if ( scopeNode ) {
            return scopeNode.findDependencies(this);
        }

        const NodeClass = this.constructor;
        const NodeName = NodeClass.name;
        throw new Error(
            `required scope for node: ${NodeName}`
        );
    }
    
}