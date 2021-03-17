import { AbstractDeclarationNode } from "./AbstractDeclarationNode";
import { AbstractNode, AnyRow } from "./AbstractNode";
import { AbstractScopeNode } from "./AbstractScopeNode";

export abstract class AbstractDependencyNode<TRow extends AnyRow>
    extends AbstractNode<TRow> {

    abstract isDependentOn(
        declarationNode: AbstractDeclarationNode<AnyRow>
    ): boolean;

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

    findDeclaration(): AbstractDeclarationNode<AnyRow> | undefined {
        return this.findScope().findDeclaration(this);
    }
}