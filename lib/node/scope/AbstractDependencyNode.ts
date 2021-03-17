import { AbstractScopeElement, AnyRow } from "./AbstractScopeElement";
import { AbstractDeclarationNode } from "./AbstractDeclarationNode";
import { AbstractScopeNode } from "./AbstractScopeNode";

export abstract class AbstractDependencyNode<TRow extends AnyRow>
    extends AbstractScopeElement<TRow> {

    /** returns true if declarationNode is dependent on this node */
    abstract isDependentOn(
        declarationNode: AbstractDeclarationNode<AnyRow>
    ): boolean;

    /** find declaration node for this */
    findDeclaration(
        scope = this.requiredFindScope()
    ): AbstractDeclarationNode<AnyRow> | undefined {

        const declarations = scope.filterChildren((declarationNode) =>
            declarationNode.is(AbstractDeclarationNode) &&
            this.isDependentOn(declarationNode)
        ) as AbstractDeclarationNode<AnyRow>[];

        const thisDeclaration = declarations[0];
        if ( thisDeclaration ) {
            return thisDeclaration;
        }

        const parentScope = scope.findParentScope();
        if ( parentScope ) {
            return this.findDeclaration(parentScope);
        }
    }

    /** check clojure */
    insideScope(parentScope: AbstractScopeNode<AnyRow>): boolean {
        const thisScope = this.requiredFindScope();
        return (
            thisScope === parentScope ||
            thisScope.hasClojure(parentScope)
        );
    }
}